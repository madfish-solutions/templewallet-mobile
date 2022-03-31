import { Dispatch } from '@reduxjs/toolkit';
import { catchError, of, Subject, switchMap } from 'rxjs';

import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { addHdAccountAction, setSelectedAccountAction } from '../../store/wallet/wallet-actions';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../toast/toast.utils';
import { getPublicKeyAndHash$ } from '../../utils/keys.util';
import { Shelter } from '../shelter';

export const createImportAccountSubscription = (
  createImportedAccount$: Subject<{ privateKey: string; name: string }>,
  accounts: Array<WalletAccountInterface>,
  dispatch: Dispatch,
  goBack: () => void
) =>
  createImportedAccount$
    .pipe(
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
      )
    )
    .subscribe(publicData => {
      if (publicData !== undefined) {
        dispatch(setSelectedAccountAction(publicData.publicKeyHash));
        dispatch(addHdAccountAction(publicData));
        showSuccessToast({ description: 'Account Imported!' });
        goBack();
      }
    });
