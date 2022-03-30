import { Dispatch } from '@reduxjs/toolkit';
import { catchError, forkJoin, map, merge, of, Subject, switchMap } from 'rxjs';

import { EventFn } from '../config/general';
import { WalletAccountInterface } from '../interfaces/wallet-account.interface';
import { StacksEnum } from '../navigator/enums/stacks.enum';
import { setIsBiometricsEnabled } from '../store/settings/settings-actions';
import { addHdAccountAction, setSelectedAccountAction } from '../store/wallet/wallet-actions';
import { showErrorToast, showSuccessToast, showWarningToast } from '../toast/toast.utils';
import { getPublicKeyAndHash$ } from '../utils/keys.util';
import { ImportWalletParams } from './interfaces/import-wallet-params.interface';
import { RevealSecretKeyParams } from './interfaces/reveal-secret-key-params.interface';
import { RevealSeedPhraseParams } from './interfaces/reveal-seed-phrase.params';
import { Shelter } from './shelter';

export const getEnableBiometryPasswordStream = (
  enableBiometryPassword$: Subject<string>,
  dispatch: Dispatch,
  navigate: (screen: StacksEnum) => void
) =>
  enableBiometryPassword$
    .pipe(
      switchMap(password =>
        Shelter.isPasswordCorrect$(password).pipe(
          switchMap(isPasswordCorrect => (isPasswordCorrect ? Shelter.enableBiometryPassword$(password) : of(false)))
        )
      )
    )
    .subscribe(isPasswordSaved => {
      if (isPasswordSaved === false) {
        showErrorToast({ description: 'Wrong password, please, try again' });
      } else {
        showSuccessToast({ description: 'Successfully enabled!' });

        dispatch(setIsBiometricsEnabled(true));
        navigate(StacksEnum.MainStack);
      }
    });

export const getImportWalletStream = (importWallet$: Subject<ImportWalletParams>, dispatch: Dispatch) =>
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
      if (importedAccounts !== undefined) {
        const firstAccount = importedAccounts[0];
        dispatch(setSelectedAccountAction(firstAccount.publicKeyHash));

        for (const account of importedAccounts) {
          dispatch(addHdAccountAction(account));
        }

        isPasswordSaved !== false && dispatch(setIsBiometricsEnabled(true));
      }
    });

export const getCreateImportAccountStream = (
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

export const getCreateHdAccountStream = (
  createHdAccount$: Subject<unknown>,
  accounts: Array<WalletAccountInterface>,
  dispatch: Dispatch
) =>
  createHdAccount$
    .pipe(switchMap(() => Shelter.createHdAccount$(`Account ${accounts.length + 1}`, accounts.length)))
    .subscribe(publicData => {
      if (publicData !== undefined) {
        dispatch(setSelectedAccountAction(publicData.publicKeyHash));
        dispatch(addHdAccountAction(publicData));
      }
    });

export const getMergeStream = (
  revealSecretKey$: Subject<RevealSecretKeyParams>,
  revealSeedPhrase$: Subject<RevealSeedPhraseParams>
) =>
  merge(
    revealSecretKey$.pipe(
      switchMap(({ publicKeyHash, successCallback }) =>
        Shelter.revealSecretKey$(publicKeyHash).pipe(
          map((secretKey): [string | undefined, EventFn<string>] => [secretKey, successCallback])
        )
      )
    ),
    revealSeedPhrase$.pipe(
      switchMap(({ successCallback }) =>
        Shelter.revealSeedPhrase$()
          .pipe(catchError(() => of(undefined)))
          .pipe(map((seedPhrase): [string | undefined, EventFn<string>] => [seedPhrase, successCallback]))
      )
    )
  ).subscribe(([value, successCallback]) => value !== undefined && successCallback(value));
