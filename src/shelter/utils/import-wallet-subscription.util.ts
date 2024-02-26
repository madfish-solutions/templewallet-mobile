import { Dispatch } from '@reduxjs/toolkit';
import { forkJoin, of, Subject, switchMap, tap } from 'rxjs';

import { hideLoaderAction, setIsBiometricsEnabled, showLoaderAction } from 'src/store/settings/settings-actions';
import { loadScamlistAction, loadWhitelistAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { addHdAccountAction, setSelectedAccountAction } from 'src/store/wallet/wallet-actions';

import { ImportWalletParams } from '../interfaces/import-wallet-params.interface';
import { Shelter } from '../shelter';

export const importWalletSubscription = (importWallet$: Subject<ImportWalletParams>, dispatch: Dispatch) =>
  importWallet$
    .pipe(
      tap(() => dispatch(showLoaderAction())),
      switchMap(({ seedPhrase, password, hdAccountsLength, useBiometry }) =>
        forkJoin([
          Shelter.importHdAccount$(seedPhrase, password, hdAccountsLength),
          useBiometry === true ? Shelter.enableBiometryPassword$(password) : of(false)
        ])
      ),
      tap(() => dispatch(hideLoaderAction()))
    )
    .subscribe(([importedAccounts, isPasswordSaved]) => {
      if (importedAccounts !== undefined) {
        const firstAccount = importedAccounts[0];
        dispatch(setSelectedAccountAction(firstAccount.publicKeyHash));

        for (const account of importedAccounts) {
          dispatch(addHdAccountAction(account));
        }

        dispatch(loadWhitelistAction.submit());
        dispatch(loadScamlistAction.submit());

        isPasswordSaved !== false && dispatch(setIsBiometricsEnabled(true));
      }
    });
