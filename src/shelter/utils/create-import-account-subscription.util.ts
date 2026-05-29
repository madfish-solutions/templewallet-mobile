import { StackActions } from '@react-navigation/native';
import type { NavigationAction } from '@react-navigation/routers';
import { Dispatch } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import Toast from 'react-native-toast-message';
import { catchError, forkJoin, from, lastValueFrom, map, merge, of, Subject, switchMap, tap } from 'rxjs';

import { LIMIT_FIN_FEATURES } from 'src/config/system';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { hideLoaderAction, setOnRampOverlayStateAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { loadWhitelistAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { addHdAccountAction, setSelectedAccountIdAction } from 'src/store/wallet/wallet-actions';
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

import { deriveSaskFromPrivateKey } from './derive-sask-from-private-key.util';

export interface CreateImportedAccountParams {
  privateKey: string;
  name: string;
  chain?: TempleChainKind;
  saplingSpendingKey?: string;
}

export interface CreateImportedMultichainAccountParams {
  seedPhrase: string;
  name: string;
  password?: string;
  chain?: TempleChainKind;
  derivationPath?: string;
}

const normalizeAddressForCompare = (chain: TempleChainKind, address: string) =>
  chain === TempleChainKind.EVM ? address.toLowerCase() : address;

const hasSameChainAddress = (accounts: Account[], chain: TempleChainKind, address: string) =>
  accounts.some(account => {
    const accountAddress = getAccountAddressForChain(account, chain);

    return accountAddress
      ? normalizeAddressForCompare(chain, accountAddress) === normalizeAddressForCompare(chain, address)
      : false;
  });

const deriveImportedChainAccountCredentials = (
  privateKey: string,
  chain: TempleChainKind
): Promise<AccountCredentials> =>
  chain === TempleChainKind.EVM
    ? Promise.resolve().then(() => privateKeyToEvmAccountCredentials(privateKey))
    : privateKeyToTezosAccountCredentials(privateKey);

const deriveImportedMultichainAccountCredentials = ({
  seedPhrase,
  password,
  chain = TempleChainKind.Tezos,
  derivationPath
}: CreateImportedMultichainAccountParams) => {
  const tezosDerivationPath = chain === TempleChainKind.Tezos ? derivationPath : getTezosDerivationPath(0);
  const evmDerivationPath =
    chain === TempleChainKind.EVM ? derivationPath ?? getEvmDerivationPath(0) : getEvmDerivationPath(0);

  return forkJoin([
    from(
      Promise.resolve().then(() => {
        const { chain: derivedChain, privateKey } = mnemonicToPrivateKey(
          seedPhrase,
          message => new Error(message),
          password,
          tezosDerivationPath
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
          password,
          evmDerivationPath
        );

        if (derivedChain !== TempleChainKind.EVM) {
          throw new Error('Invalid EVM derivation path');
        }

        return privateKeyToEvmAccountCredentials(privateKey);
      })
    )
  ]);
};

export const createImportAccountSubscription = (
  createImportedAccount$: Subject<CreateImportedAccountParams>,
  createImportedMultichainAccount$: Subject<CreateImportedMultichainAccountParams>,
  accounts: Account[],
  dispatch: Dispatch,
  navigationDispatch: (action: NavigationAction) => void,
  rpcUrl: string,
  trackErrorEvent: (error: unknown, accountPkh?: string) => void
) =>
  merge(
    createImportedAccount$.pipe(
      tap(() => {
        Toast.hide();
        dispatch(showLoaderAction());
      }),
      switchMap(({ privateKey, name, chain = TempleChainKind.Tezos, saplingSpendingKey }) =>
        from(deriveImportedChainAccountCredentials(privateKey, chain)).pipe(
          switchMap(({ address }) => {
            if (hasSameChainAddress(accounts, chain, address)) {
              showWarningToast({ description: 'Account already exist' });

              return of(undefined);
            }

            return Shelter.createImportedChainAccount$(privateKey, name, chain).pipe(
              switchMap(publicData => {
                if (chain === TempleChainKind.EVM) {
                  return of(publicData);
                }

                const sask$ = saplingSpendingKey ? of(saplingSpendingKey) : from(deriveSaskFromPrivateKey(privateKey));

                return sask$.pipe(
                  switchMap(sask => Shelter.saveSaplingSpendingKey$(getAccountAddressForTezos(publicData) ?? '', sask)),
                  map(() => publicData),
                  catchError(() => of(publicData))
                );
              })
            );
          }),
          catchError(() => {
            showErrorToast({
              title: 'Failed to import account.',
              description: 'This may happen because provided Key is invalid.'
            });

            return of(undefined);
          })
        )
      ),
      tap(() => dispatch(hideLoaderAction()))
    ),
    createImportedMultichainAccount$.pipe(
      tap(() => {
        Toast.hide();
        dispatch(showLoaderAction());
      }),
      switchMap(params =>
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
              name: params.name,
              bip39Passphrase: params.password,
              chain: params.chain,
              derivationPath: params.derivationPath
            });
          }),
          catchError(() => {
            showErrorToast({
              title: 'Failed to import account.',
              description: 'This may happen because provided Seed Phrase is invalid.'
            });

            return of(undefined);
          })
        )
      ),
      tap(() => dispatch(hideLoaderAction()))
    )
  ).subscribe(publicData => {
    if (publicData !== undefined) {
      dispatch(setSelectedAccountIdAction(publicData.id));
      dispatch(addHdAccountAction(publicData));

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
