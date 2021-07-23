import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { forkJoin, merge, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { EventFn } from '../config/general';
import { StacksEnum } from '../navigator/enums/stacks.enum';
import { useNavigation } from '../navigator/hooks/use-navigation.hook';
import { setIsBiometricsEnabled } from '../store/settings/settings-actions';
import { addHdAccountAction, setSelectedAccountAction } from '../store/wallet/wallet-actions';
import { useHdAccountsListSelector } from '../store/wallet/wallet-selectors';
import { showErrorToast, showSuccessToast } from '../toast/toast.utils';
import { ImportWalletParams } from './interfaces/import-wallet-params.interface';
import { RevealSecretKeyParams } from './interfaces/reveal-secret-key-params.interface';
import { RevealSeedPhraseParams } from './interfaces/reveal-seed-phrase.params';
import { Shelter } from './shelter';

export const useShelter = () => {
  const dispatch = useDispatch();
  const hdAccounts = useHdAccountsListSelector();
  const { navigate, goBack } = useNavigation();

  const importWallet$ = useMemo(() => new Subject<ImportWalletParams>(), []);
  const createHdAccount$ = useMemo(() => new Subject<string>(), []);
  const revealSecretKey$ = useMemo(() => new Subject<RevealSecretKeyParams>(), []);
  const revealSeedPhrase$ = useMemo(() => new Subject<RevealSeedPhraseParams>(), []);
  const enableBiometryPassword$ = useMemo(() => new Subject<string>(), []);

  useEffect(() => {
    const subscriptions = [
      importWallet$
        .pipe(
          switchMap(({ seedPhrase, password, useBiometry }) =>
            forkJoin([
              Shelter.importHdAccount$(seedPhrase, password),
              useBiometry ? Shelter.enableBiometryPassword$(password) : of(false)
            ])
          )
        )
        .subscribe(([publicData, isPasswordSaved]) => {
          if (publicData !== undefined) {
            dispatch(setSelectedAccountAction(publicData.publicKeyHash));
            dispatch(addHdAccountAction(publicData));

            isPasswordSaved && dispatch(setIsBiometricsEnabled(true));
          }
        }),
      createHdAccount$
        .pipe(switchMap(name => Shelter.createHdAccount$(name, hdAccounts.length)))
        .subscribe(publicData => {
          if (publicData !== undefined) {
            dispatch(setSelectedAccountAction(publicData.publicKeyHash));
            dispatch(addHdAccountAction(publicData));
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
          switchMap(password =>
            Shelter.isPasswordCorrect(password) ? Shelter.enableBiometryPassword$(password) : of(false)
          )
        )
        .subscribe(isPasswordSaved => {
          if (isPasswordSaved) {
            showSuccessToast({ text: 'Successfully enabled!' });

            dispatch(setIsBiometricsEnabled(true));
            navigate(StacksEnum.MainStack);
          } else {
            showErrorToast({ text: 'Wrong password, please, try again' });
          }
        })
    ];

    return () => void subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [dispatch, importWallet$, revealSecretKey$, createHdAccount$, hdAccounts.length, goBack, revealSeedPhrase$]);

  const importWallet = (seedPhrase: string, password: string, useBiometry?: boolean) =>
    importWallet$.next({ seedPhrase, password, useBiometry });
  const createHdAccount = (name: string) => createHdAccount$.next(name);

  const revealSecretKey = (params: RevealSecretKeyParams) => revealSecretKey$.next(params);
  const revealSeedPhrase = (params: RevealSeedPhraseParams) => revealSeedPhrase$.next(params);

  const enableBiometryPassword = (password: string) => enableBiometryPassword$.next(password);

  return { importWallet, createHdAccount, revealSecretKey, revealSeedPhrase, enableBiometryPassword };
};
