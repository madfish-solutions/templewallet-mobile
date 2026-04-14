import { StackActions } from '@react-navigation/native';
import type { NavigationAction } from '@react-navigation/routers';
import { Dispatch } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import Toast from 'react-native-toast-message';
import { catchError, from, lastValueFrom, map, of, Subject, switchMap, tap } from 'rxjs';

import { LIMIT_FIN_FEATURES } from 'src/config/system';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { hideLoaderAction, setOnRampOverlayStateAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { loadWhitelistAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { addHdAccountAction, setSelectedAccountAction } from 'src/store/wallet/wallet-actions';
import { showErrorToast, showSuccessToast, showWarningToast } from 'src/toast/toast.utils';
import { getPublicKeyAndHash$ } from 'src/utils/keys.util';
import { isDcpNode } from 'src/utils/network.utils';
import { loadTezosBalance$ } from 'src/utils/token-balance.utils';

import { Shelter } from '../shelter';

import { deriveSaskFromPrivateKey } from './derive-sask-from-private-key.util';

export const createImportAccountSubscription = (
  createImportedAccount$: Subject<{ privateKey: string; name: string; saplingSpendingKey?: string }>,
  accounts: AccountInterface[],
  dispatch: Dispatch,
  navigationDispatch: (action: NavigationAction) => void,
  rpcUrl: string,
  trackErrorEvent: (error: unknown, accountPkh?: string) => void
) =>
  createImportedAccount$
    .pipe(
      tap(() => {
        Toast.hide();
        dispatch(showLoaderAction());
      }),
      switchMap(({ privateKey, name, saplingSpendingKey }) =>
        getPublicKeyAndHash$(privateKey).pipe(
          switchMap(([publicKey]) => {
            for (const account of accounts) {
              if (account.publicKey === publicKey) {
                showWarningToast({ description: 'Account already exist' });

                return of(undefined);
              }
            }

            return Shelter.createImportedAccount$(privateKey, name).pipe(
              switchMap(publicData => {
                const sask$ = saplingSpendingKey ? of(saplingSpendingKey) : from(deriveSaskFromPrivateKey(privateKey));

                return sask$.pipe(
                  switchMap(sask => Shelter.saveSaplingSpendingKey$(publicData.publicKeyHash, sask)),
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
    )
    .subscribe(publicData => {
      if (publicData !== undefined) {
        dispatch(setSelectedAccountAction(publicData.publicKeyHash));
        dispatch(addHdAccountAction(publicData));
        dispatch(loadWhitelistAction.submit());

        navigationDispatch(StackActions.popToTop());
        setTimeout(() => showSuccessToast({ description: 'Account Imported!' }), 100);

        lastValueFrom(loadTezosBalance$(rpcUrl, publicData.publicKeyHash)).then(
          balance =>
            void (
              !LIMIT_FIN_FEATURES &&
              new BigNumber(balance).isEqualTo(0) &&
              !isDcpNode(rpcUrl) &&
              dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Start))
            ),
          error => {
            console.error(error);
            trackErrorEvent(error, publicData.publicKeyHash);
          }
        );
      }
    });
