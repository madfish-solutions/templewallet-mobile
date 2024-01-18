import { StackActions } from '@react-navigation/native';
import type { NavigationAction } from '@react-navigation/routers';
import { Dispatch } from '@reduxjs/toolkit';
import { catchError, of, Subject, switchMap, tap } from 'rxjs';

import { AccountInterface } from '../../interfaces/account.interface';
import { hideLoaderAction, showLoaderAction } from '../../store/settings/settings-actions';
import { loadWhitelistAction } from '../../store/tokens-metadata/tokens-metadata-actions';
import { addHdAccountAction, setSelectedAccountAction } from '../../store/wallet/wallet-actions';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../toast/toast.utils';
import { getPublicKeyAndHash$ } from '../../utils/keys.util';
import { Shelter } from '../shelter';

export const createImportAccountSubscription = (
  createImportedAccount$: Subject<{ privateKey: string; name: string }>,
  accounts: AccountInterface[],
  dispatch: Dispatch,
  navigationDispatch: (action: NavigationAction) => void
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
      }
    });
