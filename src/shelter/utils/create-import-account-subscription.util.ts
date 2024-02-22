import { StackActions } from '@react-navigation/native';
import type { NavigationAction } from '@react-navigation/routers';
import { Dispatch } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import { catchError, lastValueFrom, of, Subject, switchMap, tap } from 'rxjs';

import { isAndroid } from 'src/config/system';
import { AccountInterface } from 'src/interfaces/account.interface';
import { hideLoaderAction, setOnRampPossibilityAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { loadWhitelistAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { addHdAccountAction, setSelectedAccountAction } from 'src/store/wallet/wallet-actions';
import { showErrorToast, showSuccessToast, showWarningToast } from 'src/toast/toast.utils';
import { getPublicKeyAndHash$ } from 'src/utils/keys.util';
import { loadTezosBalance$ } from 'src/utils/token-balance.utils';

import { Shelter } from '../shelter';

export const createImportAccountSubscription = (
  createImportedAccount$: Subject<{ privateKey: string; name: string }>,
  accounts: AccountInterface[],
  dispatch: Dispatch,
  navigationDispatch: (action: NavigationAction) => void,
  rpcUrl: string
) =>
  createImportedAccount$
    .pipe(
      tap(() => dispatch(showLoaderAction())),
      switchMap(({ privateKey, name }) =>
        getPublicKeyAndHash$(privateKey).pipe(
          switchMap(([publicKey]) => {
            for (const account of accounts) {
              if (account.publicKey === publicKey) {
                showWarningToast({ description: 'Account already exist' });

                return of(undefined);
              }
            }

            return Shelter.createImportedAccount$(privateKey, name);
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

        showSuccessToast({ description: 'Account Imported!' });
        navigationDispatch(StackActions.popToTop());

        lastValueFrom(loadTezosBalance$(rpcUrl, publicData.publicKeyHash)).then(
          balance =>
            void (isAndroid && new BigNumber(balance).isEqualTo(0) && dispatch(setOnRampPossibilityAction(true))),
          error => console.error(error)
        );
      }
    });
