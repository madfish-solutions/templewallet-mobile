import { catchError, concatMap, EMPTY, finalize, forkJoin, of, Subject, tap } from 'rxjs';

import { dispatch } from 'src/store';
import { cacheSaplingCredentialsAction, loadShieldedBalanceActions } from 'src/store/sapling/sapling-actions';
import {
  hideLoaderAction,
  setIsBiometricsEnabled,
  setKoloForceLogoutOnNextOpenAction,
  showLoaderAction
} from 'src/store/settings/settings-actions';
import { loadWhitelistAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { addAccountsAction, setSelectedAccountIdAction } from 'src/store/wallet/wallet-actions';

import { ImportWalletParams } from '../interfaces/import-wallet-params.interface';
import { Shelter } from '../shelter';

const IMPORT_WALLET_ERROR_MESSAGE = 'Failed to import wallet';

export interface ImportWalletRequest {
  params: ImportWalletParams;
  resolve: EmptyFn;
  reject: (error: Error) => void;
}

export const importWalletSubscription = (importWallet$: Subject<ImportWalletRequest>) =>
  importWallet$
    .pipe(
      concatMap(({ params: { seedPhrase, password, hdAccountsLength, useBiometry }, resolve, reject }) => {
        dispatch(showLoaderAction());

        return forkJoin([
          Shelter.importWallet$(seedPhrase, password, hdAccountsLength),
          useBiometry === true ? Shelter.enableBiometryPassword$(password) : of(false)
        ]).pipe(
          tap(([importResult, isPasswordSaved]) => {
            if (!importResult?.accounts.length) {
              throw new Error(IMPORT_WALLET_ERROR_MESSAGE);
            }

            const { accounts, saplingCredentials } = importResult;

            dispatch(cacheSaplingCredentialsAction(saplingCredentials));
            dispatch(addAccountsAction(accounts));
            dispatch(setSelectedAccountIdAction(accounts[0].id));
            dispatch(loadShieldedBalanceActions.submit());
            dispatch(loadWhitelistAction.submit());

            isPasswordSaved !== false && dispatch(setIsBiometricsEnabled(true));

            dispatch(setKoloForceLogoutOnNextOpenAction(true));
          }),
          tap({ next: resolve, error: reject }),
          catchError(() => EMPTY),
          finalize(() => dispatch(hideLoaderAction()))
        );
      })
    )
    .subscribe();
