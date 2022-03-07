import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { EMPTY, forkJoin, merge, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { EventFn } from '../config/general';
import { StacksEnum } from '../navigator/enums/stacks.enum';
import { useNavigation } from '../navigator/hooks/use-navigation.hook';
import { setIsBiometricsEnabled } from '../store/settings/settings-actions';
import { addHdAccountAction, setSelectedAccountAction } from '../store/wallet/wallet-actions';
import { useAccountsListSelector } from '../store/wallet/wallet-selectors';
import { showErrorToast, showSuccessToast, showWarningToast } from '../toast/toast.utils';
import { getPublicKeyAndHash$ } from '../utils/keys.util';
import { ImportWalletParams } from './interfaces/import-wallet-params.interface';
import { RevealSecretKeyParams } from './interfaces/reveal-secret-key-params.interface';
import { RevealSeedPhraseParams } from './interfaces/reveal-seed-phrase.params';
import { Shelter } from './shelter';

export const useShelter = () => {
  const dispatch = useDispatch();
  const accounts = useAccountsListSelector();
  const { navigate, goBack } = useNavigation();

  const importWallet$ = useMemo(() => new Subject<ImportWalletParams>(), []);
  const createHdAccount$ = useMemo(() => new Subject(), []);
  const revealSecretKey$ = useMemo(() => new Subject<RevealSecretKeyParams>(), []);
  const revealSeedPhrase$ = useMemo(() => new Subject<RevealSeedPhraseParams>(), []);
  const enableBiometryPassword$ = useMemo(() => new Subject<string>(), []);
  const createImportedAccount$ = useMemo(() => new Subject<{ privateKey: string; name: string }>(), []);

  useEffect(() => {
    const subscriptions = [
      importWallet$
        .pipe(
          switchMap(({ seedPhrase, password, hdAccountsLength, useBiometry }) =>
            forkJoin([
              Shelter.importHdAccount$(seedPhrase, password, hdAccountsLength),
              useBiometry === true ? Shelter.enableBiometryPassword$(password) : of(false)
            ])
          )
        )
        .subscribe(([accounts, isPasswordSaved]) => {
          if (accounts !== undefined) {
            const firstAccount = accounts[0];
            dispatch(setSelectedAccountAction(firstAccount.publicKeyHash));

            for (const account of accounts) {
              dispatch(addHdAccountAction(account));
            }

            isPasswordSaved !== false && dispatch(setIsBiometricsEnabled(true));
          }
        }),
      createHdAccount$
        .pipe(switchMap(() => Shelter.createHdAccount$(`Account ${accounts.length + 1}`, accounts.length)))
        .subscribe(publicData => {
          if (publicData !== undefined) {
            dispatch(setSelectedAccountAction(publicData.publicKeyHash));
            dispatch(addHdAccountAction(publicData));
          }
        }),
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
        }),

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
      ).subscribe(([value, successCallback]) => value !== undefined && successCallback(value)),

      enableBiometryPassword$
        .pipe(
          switchMap(async password =>
            (await Shelter.isPasswordCorrect(password)) ? Shelter.enableBiometryPassword$(password) : of(false)
          )
        )
        .subscribe(isPasswordSaved => {
          if (typeof isPasswordSaved === 'boolean' && isPasswordSaved === false) {
            showErrorToast({ description: 'Wrong password, please, try again' });
          } else {
            showSuccessToast({ description: 'Successfully enabled!' });

            dispatch(setIsBiometricsEnabled(true));
            navigate(StacksEnum.MainStack);
          }
        })
    ];

    return () => subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [dispatch, importWallet$, revealSecretKey$, createHdAccount$, accounts.length, goBack, revealSeedPhrase$]);

  const importWallet = (params: ImportWalletParams) => importWallet$.next(params);
  const createHdAccount = () => createHdAccount$.next(EMPTY);
  const revealSecretKey = (params: RevealSecretKeyParams) => revealSecretKey$.next(params);
  const revealSeedPhrase = (params: RevealSeedPhraseParams) => revealSeedPhrase$.next(params);

  const enableBiometryPassword = (password: string) => enableBiometryPassword$.next(password);

  const createImportedAccount = (params: { privateKey: string; name: string }) => createImportedAccount$.next(params);

  return {
    importWallet,
    createHdAccount,
    revealSecretKey,
    revealSeedPhrase,
    enableBiometryPassword,
    createImportedAccount
  };
};
