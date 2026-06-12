import { StackActions } from '@react-navigation/native';
import type { NavigationAction } from '@react-navigation/routers';
import { BigNumber } from 'bignumber.js';
import Toast from 'react-native-toast-message';
import { catchError, forkJoin, from, lastValueFrom, map, merge, Observable, of, Subject, switchMap, tap } from 'rxjs';

import { LIMIT_FIN_FEATURES } from 'src/config/system';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { dispatch } from 'src/store';
import { hideLoaderAction, setOnRampOverlayStateAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { loadWhitelistAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { addAccountAction, setSelectedAccountIdAction } from 'src/store/wallet/wallet-actions';
import { showErrorToast, showSuccessToast, showWarningToast } from 'src/toast/toast.utils';
import { getAccountAddressForChain, getAccountAddressForTezos } from 'src/utils/account.utils';
import {
  AccountCredentials,
  getEvmDerivationPath,
  getTezosDerivationPath,
  mnemonicToPrivateKey,
  privateKeyToEvmAccountCredentials,
  privateKeyToTezosAccountCredentials
} from 'src/utils/keys.utils';
import { isDcpNode } from 'src/utils/network.utils';
import { loadTezosBalance$ } from 'src/utils/token-balance.utils';

import { Shelter } from '../shelter';

import { hasSameChainAddress } from './common.utils.ts';
import { deriveSaskFromPrivateKey } from './derive-sask-from-private-key.util';

export interface CreateImportedChainAccountFromPrivateKeyParams {
  privateKey: string;
  name: string;
  chain: TempleChainKind;
}

export interface CreateImportedChainAccountFromSeedParams {
  seedPhrase: string;
  name: string;
  derivationPath: string;
}

export interface CreateImportedMultichainAccountFromSeedParams {
  seedPhrase: string;
  name: string;
}

export enum AccountImportType {
  ChainPrivateKey = 'chainPrivateKey',
  ChainSeed = 'chainSeed',
  MultichainSeed = 'multichainSeed'
}

export interface CreateImportedChainAccountFromPrivateKeyRequest
  extends CreateImportedChainAccountFromPrivateKeyParams {
  type: AccountImportType.ChainPrivateKey;
}

export interface CreateImportedChainAccountFromSeedRequest extends CreateImportedChainAccountFromSeedParams {
  type: AccountImportType.ChainSeed;
}

export interface CreateImportedMultichainAccountFromSeedRequest extends CreateImportedMultichainAccountFromSeedParams {
  type: AccountImportType.MultichainSeed;
}

type AccountImportRequest =
  | CreateImportedChainAccountFromPrivateKeyRequest
  | CreateImportedChainAccountFromSeedRequest
  | CreateImportedMultichainAccountFromSeedRequest;

const importErrorDescriptions: Record<AccountImportType, string> = {
  [AccountImportType.ChainPrivateKey]: 'This may happen because provided Key is invalid.',
  [AccountImportType.ChainSeed]: 'This may happen because provided Seed Phrase or Derivation Path is invalid.',
  [AccountImportType.MultichainSeed]: 'This may happen because provided Seed Phrase is invalid.'
};

export const createAccountImportSubscriptions = (
  createImportedChainAccountFromPrivateKey$: Subject<CreateImportedChainAccountFromPrivateKeyRequest>,
  createImportedChainAccountFromSeed$: Subject<CreateImportedChainAccountFromSeedRequest>,
  createImportedMultichainAccountFromSeed$: Subject<CreateImportedMultichainAccountFromSeedRequest>,
  accounts: Account[],
  navigationDispatch: (action: NavigationAction) => void,
  rpcUrl: string,
  trackErrorEvent: (error: unknown, accountPkh?: string) => void
) =>
  merge(
    createImportedChainAccountFromPrivateKey$,
    createImportedChainAccountFromSeed$,
    createImportedMultichainAccountFromSeed$
  )
    .pipe(
      tap(() => {
        Toast.hide();
        dispatch(showLoaderAction());
      }),
      switchMap(request =>
        importAccount$(request, accounts).pipe(
          catchError(() => {
            showErrorToast({
              title: 'Failed to import account.',
              description: importErrorDescriptions[request.type]
            });

            return of(undefined);
          }),
          tap(() => dispatch(hideLoaderAction()))
        )
      )
    )
    .subscribe(publicData => {
      if (publicData !== undefined) {
        dispatch(setSelectedAccountIdAction(publicData.id));
        dispatch(addAccountAction(publicData));

        navigationDispatch(StackActions.popToTop());
        setTimeout(() => showSuccessToast({ description: 'Account Imported!' }), 100);

        const tezosAddress = getAccountAddressForChain(publicData, TempleChainKind.Tezos);

        if (tezosAddress) {
          dispatch(loadWhitelistAction.submit());

          lastValueFrom(loadTezosBalance$(rpcUrl, tezosAddress)).then(
            balance =>
              void (
                !LIMIT_FIN_FEATURES &&
                new BigNumber(balance).isEqualTo(0) &&
                !isDcpNode(rpcUrl) &&
                dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Start))
              ),
            error => {
              console.error(error);
              trackErrorEvent(error, tezosAddress);
            }
          );
        }
      }
    });

const importAccount$ = (request: AccountImportRequest, accounts: Account[]): Observable<Account | undefined> => {
  switch (request.type) {
    case AccountImportType.ChainPrivateKey:
      return importChainAccountFromPrivateKey$(request, accounts);
    case AccountImportType.ChainSeed:
      return importChainAccountFromSeed$(request, accounts);
    case AccountImportType.MultichainSeed:
      return importMultichainAccountFromSeed$(request, accounts);
  }
};

const importChainAccountFromPrivateKey$ = (
  { privateKey, name, chain }: CreateImportedChainAccountFromPrivateKeyParams,
  accounts: Account[]
): Observable<Account | undefined> => {
  return from(deriveImportedChainAccountCredentials(privateKey, chain)).pipe(
    switchMap(({ address }) => createImportedChainAccountIfUnique$(accounts, chain, address, privateKey, name)),
    switchMap(publicData => saveSaplingSpendingKeyForTezosAccount$(publicData, privateKey))
  );
};

const importChainAccountFromSeed$ = (
  params: CreateImportedChainAccountFromSeedParams,
  accounts: Account[]
): Observable<Account | undefined> =>
  deriveImportedChainAccountFromSeed(params).pipe(
    switchMap(({ chain, credentials, privateKey }) =>
      createImportedChainAccountIfUnique$(accounts, chain, credentials.address, privateKey, params.name).pipe(
        switchMap(publicData => saveSaplingSpendingKeyForTezosAccount$(publicData, privateKey))
      )
    )
  );

const importMultichainAccountFromSeed$ = (
  params: CreateImportedMultichainAccountFromSeedParams,
  accounts: Account[]
): Observable<Account | undefined> =>
  deriveImportedMultichainAccountCredentials(params).pipe(
    switchMap(([tezosCredentials, evmCredentials]) => {
      const hasCollision =
        hasSameChainAddress(accounts, TempleChainKind.Tezos, tezosCredentials.address) ||
        hasSameChainAddress(accounts, TempleChainKind.EVM, evmCredentials.address);

      if (hasCollision) {
        showWarningToast({ description: 'Account already exist' });

        return of(undefined);
      }

      return Shelter.createImportedMultichainAccount$(params.seedPhrase, params.name);
    })
  );

const createImportedChainAccountIfUnique$ = (
  accounts: Account[],
  chain: TempleChainKind,
  address: string,
  privateKey: string,
  name: string
): Observable<Account | undefined> => {
  if (hasSameChainAddress(accounts, chain, address)) {
    showWarningToast({ description: 'Account already exist' });

    return of(undefined);
  }

  return Shelter.createImportedChainAccount$(privateKey, name, chain);
};

const saveSaplingSpendingKeyForTezosAccount$ = (
  publicData: Account | undefined,
  privateKey: string
): Observable<Account | undefined> => {
  const tezosAddress = publicData ? getAccountAddressForTezos(publicData) : undefined;

  if (!publicData || !tezosAddress) {
    return of(publicData);
  }

  return from(deriveSaskFromPrivateKey(privateKey)).pipe(
    switchMap(sask => Shelter.saveSaplingSpendingKey$(tezosAddress, sask)),
    map(() => publicData),
    catchError(() => of(publicData))
  );
};

const deriveImportedChainAccountCredentials = (
  privateKey: string,
  chain: TempleChainKind
): Promise<AccountCredentials> =>
  chain === TempleChainKind.EVM
    ? Promise.resolve().then(() => privateKeyToEvmAccountCredentials(privateKey))
    : privateKeyToTezosAccountCredentials(privateKey);

const deriveImportedChainAccountFromSeed = ({
  seedPhrase,
  derivationPath
}: CreateImportedChainAccountFromSeedParams) => {
  const { chain, privateKey } = mnemonicToPrivateKey(seedPhrase, message => new Error(message), derivationPath);

  return from(deriveImportedChainAccountCredentials(privateKey, chain)).pipe(
    map(credentials => ({
      chain,
      credentials,
      privateKey
    }))
  );
};

const deriveImportedMultichainAccountCredentials = ({ seedPhrase }: CreateImportedMultichainAccountFromSeedParams) => {
  return forkJoin([
    from(
      Promise.resolve().then(() => {
        const { privateKey } = mnemonicToPrivateKey(
          seedPhrase,
          message => new Error(message),
          getTezosDerivationPath(0)
        );

        return privateKeyToTezosAccountCredentials(privateKey);
      })
    ),
    from(
      Promise.resolve().then(() => {
        const { privateKey } = mnemonicToPrivateKey(seedPhrase, message => new Error(message), getEvmDerivationPath(0));

        return privateKeyToEvmAccountCredentials(privateKey);
      })
    )
  ]);
};
