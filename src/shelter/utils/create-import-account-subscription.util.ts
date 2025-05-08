import { StackActions } from '@react-navigation/native';
import type { NavigationAction } from '@react-navigation/routers';
import { Dispatch } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import { catchError, lastValueFrom, of, Subject, switchMap, tap } from 'rxjs';

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
            void (
              !LIMIT_FIN_FEATURES &&
              new BigNumber(balance).isEqualTo(0) &&
              !isDcpNode(rpcUrl) &&
              dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Start))
            ),
          error => console.error(error)
        );
      }
    });
