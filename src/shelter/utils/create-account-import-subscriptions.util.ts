import { StackActions } from '@react-navigation/native';
import type { NavigationAction } from '@react-navigation/routers';
import { Dispatch } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import Toast from 'react-native-toast-message';
import { catchError, forkJoin, from, lastValueFrom, map, merge, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { isAddressEqual } from 'viem';

import { LIMIT_FIN_FEATURES } from 'src/config/system';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { hideLoaderAction, setOnRampOverlayStateAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { loadWhitelistAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { addAccountAction, setSelectedAccountIdAction } from 'src/store/wallet/wallet-actions';
import { showErrorToast, showSuccessToast, showWarningToast } from 'src/toast/toast.utils';
import { getAccountAddressForChain, getAccountAddressForTezos } from 'src/utils/account.utils';
import {
  AccountCredentials,
  getEvmDerivationPath,
  getPrivateKeyWithChain,
  getTezosDerivationPath,
  mnemonicToPrivateKey,
  privateKeyToEvmAccountCredentials,
  privateKeyToTezosAccountCredentials
} from 'src/utils/keys.utils';
import { isDcpNode } from 'src/utils/network.utils';
import { loadTezosBalance$ } from 'src/utils/token-balance.utils';

import { Shelter } from '../shelter';

import { deriveSaskFromPrivateKey } from './derive-sask-from-private-key.util';

export interface CreateImportedChainAccountFromPrivateKeyParams {
  privateKey: string;
  name: string;
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

type ImportAccountRequest =
  | { type: 'chainPrivateKey'; params: CreateImportedChainAccountFromPrivateKeyParams }
  | { type: 'chainSeed'; params: CreateImportedChainAccountFromSeedParams }
  | { type: 'multichainSeed'; params: CreateImportedMultichainAccountFromSeedParams };

const importErrorDescriptions: Record<ImportAccountRequest['type'], string> = {
  chainPrivateKey: 'This may happen because provided Key is invalid.',
  chainSeed: 'This may happen because provided Seed Phrase or Derivation Path is invalid.',
  multichainSeed: 'This may happen because provided Seed Phrase is invalid.'
};

export const createAccountImportSubscriptions = (
  createImportedChainAccountFromPrivateKey$: Subject<CreateImportedChainAccountFromPrivateKeyParams>,
  createImportedChainAccountFromSeed$: Subject<CreateImportedChainAccountFromSeedParams>,
  createImportedMultichainAccountFromSeed$: Subject<CreateImportedMultichainAccountFromSeedParams>,
  accounts: Account[],
  dispatch: Dispatch,
  navigationDispatch: (action: NavigationAction) => void,
  rpcUrl: string,
  trackErrorEvent: (error: unknown, accountPkh?: string) => void
) =>
  merge(
    createImportedChainAccountFromPrivateKey$.pipe(map(params => ({ type: 'chainPrivateKey' as const, params }))),
    createImportedChainAccountFromSeed$.pipe(map(params => ({ type: 'chainSeed' as const, params }))),
    createImportedMultichainAccountFromSeed$.pipe(map(params => ({ type: 'multichainSeed' as const, params })))
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

const importAccount$ = (request: ImportAccountRequest, accounts: Account[]): Observable<Account | undefined> => {
  switch (request.type) {
    case 'chainPrivateKey':
      return importChainAccountFromPrivateKey$(request.params, accounts);
    case 'chainSeed':
      return importChainAccountFromSeed$(request.params, accounts);
    case 'multichainSeed':
      return importMultichainAccountFromSeed$(request.params, accounts);
  }
};

const importChainAccountFromPrivateKey$ = (
  { privateKey, name }: CreateImportedChainAccountFromPrivateKeyParams,
  accounts: Account[]
): Observable<Account | undefined> => {
  const { privateKey: normalizedPrivateKey, chain } = getPrivateKeyWithChain(privateKey);

  return from(deriveImportedChainAccountCredentials(normalizedPrivateKey, chain)).pipe(
    switchMap(({ address }) =>
      createImportedChainAccountIfUnique$(accounts, chain, address, normalizedPrivateKey, name)
    ),
    switchMap(publicData => saveSaplingSpendingKeyForTezosAccount$(publicData, normalizedPrivateKey))
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

      return Shelter.createImportedMultichainAccount$({
        seedPhrase: params.seedPhrase,
        name: params.name
      });
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

const hasSameChainAddress = (accounts: Account[], chain: TempleChainKind, address: string) =>
  accounts.some(account => {
    const accountAddress = getAccountAddressForChain(account, chain);

    if (!accountAddress) {
      return false;
    }

    return chain === TempleChainKind.EVM
      ? isAddressEqual(accountAddress as HexString, address as HexString)
      : accountAddress === address;
  });

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
  const { chain, privateKey } = mnemonicToPrivateKey(
    seedPhrase,
    message => new Error(message),
    undefined,
    derivationPath
  );

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
        const { chain: derivedChain, privateKey } = mnemonicToPrivateKey(
          seedPhrase,
          message => new Error(message),
          undefined,
          getTezosDerivationPath(0)
        );

        if (derivedChain !== TempleChainKind.Tezos) {
          throw new Error('Invalid Tezos derivation path');
        }

        return privateKeyToTezosAccountCredentials(privateKey);
      })
    ),
    from(
      Promise.resolve().then(() => {
        const { chain: derivedChain, privateKey } = mnemonicToPrivateKey(
          seedPhrase,
          message => new Error(message),
          undefined,
          getEvmDerivationPath(0)
        );

        if (derivedChain !== TempleChainKind.EVM) {
          throw new Error('Invalid EVM derivation path');
        }

        return privateKeyToEvmAccountCredentials(privateKey);
      })
    )
  ]);
};
