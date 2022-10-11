import { Dispatch } from '@reduxjs/toolkit';
import { forkJoin, of, Subject, switchMap } from 'rxjs';

import { setIsBiometricsEnabled, setLoadingAction } from '../../store/settings/settings-actions';
import { loadWhitelistAction } from '../../store/tokens-metadata/tokens-metadata-actions';
import { addHdAccountAction, setSelectedAccountAction } from '../../store/wallet/wallet-actions';
import { ImportWalletParams } from '../interfaces/import-wallet-params.interface';
import { Shelter } from '../shelter';

export const importWalletSubscription = (importWallet$: Subject<ImportWalletParams>, dispatch: Dispatch) =>
  importWallet$
    .pipe(
      switchMap(({ seedPhrase, password, hdAccountsLength, useBiometry }) =>
        forkJoin([
          Shelter.importHdAccount$(seedPhrase, password, hdAccountsLength),
          useBiometry === true ? Shelter.enableBiometryPassword$(password) : of(false)
        ])
      )
    )
    .subscribe(([importedAccounts, isPasswordSaved]) => {
      dispatch(setLoadingAction(false));
      if (importedAccounts !== undefined) {
        const firstAccount = importedAccounts[0];
        dispatch(setSelectedAccountAction(firstAccount.publicKeyHash));

        for (const account of importedAccounts) {
          dispatch(addHdAccountAction(account));
        }

        dispatch(loadWhitelistAction.submit());

        isPasswordSaved !== false && dispatch(setIsBiometricsEnabled(true));
      }
    });
