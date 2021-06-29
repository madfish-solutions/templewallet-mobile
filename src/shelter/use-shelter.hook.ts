import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { merge, of, Subject } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { EventFn } from '../config/general';
import { useNavigation } from '../navigator/hooks/use-navigation.hook';
import { addHdAccountAction, setSelectedAccountAction } from '../store/wallet/wallet-actions';
import { useHdAccountsListSelector } from '../store/wallet/wallet-selectors';
import { showErrorToast, showSuccessToast } from '../toast/toast.utils';
import { tezos$ } from '../utils/network/network.util';
import { ImportWalletParams } from './interfaces/import-wallet-params.interface';
import { RevealSecretKeyParams } from './interfaces/reveal-secret-key-params.interface';
import { RevealSeedPhraseParams } from './interfaces/reveal-seed-phrase.params';
import { SendParams } from './interfaces/send-params.interface';
import { Shelter } from './shelter';

const KNOWN_BIOMETRY_ERROR_MESSAGES: Record<string, string> = {
  BIOMETRIC_ERROR_NONE_ENROLLED: 'No strong biometrics are enrolled',
  BIOMETRIC_ERROR_HW_UNAVAILABLE: 'No biometrics are supported or enabled',
  BIOMETRIC_ERROR_NO_HARDWARE: 'No hardware for biometrics was found',
  BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED: 'A security update is required to use biometrics'
};

export const useShelter = () => {
  const dispatch = useDispatch();
  const hdAccounts = useHdAccountsListSelector();
  const { goBack } = useNavigation();

  const createBiometricsKeys$ = useMemo(() => new Subject(), []);
  const importWallet$ = useMemo(() => new Subject<ImportWalletParams>(), []);
  const send$ = useMemo(() => new Subject<SendParams>(), []);
  const createHdAccount$ = useMemo(() => new Subject<string>(), []);
  const revealSecretKey$ = useMemo(() => new Subject<RevealSecretKeyParams>(), []);
  const revealSeedPhrase$ = useMemo(() => new Subject<RevealSeedPhraseParams>(), []);

  useEffect(() => {
    const subscriptions = [
      createBiometricsKeys$.pipe(switchMap(() => Shelter.createBiometricsKeys$())).subscribe(
        () => showSuccessToast('Success', 'Biometric keys created successfully'),
        error => showErrorToast(KNOWN_BIOMETRY_ERROR_MESSAGES[error.message] ?? error.message)
      ),
      importWallet$
        .pipe(switchMap(({ seedPhrase, password }) => Shelter.importHdAccount$(seedPhrase, password)))
        .subscribe(publicData => {
          if (publicData !== undefined) {
            dispatch(setSelectedAccountAction(publicData.publicKeyHash));
            dispatch(addHdAccountAction(publicData));
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

      send$
        .pipe(
          switchMap(({ publicKeyHash, opParams, successCallback }) =>
            Shelter.getSigner$(publicKeyHash).pipe(
              withLatestFrom(tezos$),
              switchMap(([signer, tezos]) => {
                tezos.setProvider({ signer });

                return tezos.wallet.batch(opParams).send();
              }),
              map(({ opHash }) => ({ opHash, successCallback }))
            )
          )
        )
        .subscribe(
          ({ opHash, successCallback }) => {
            successCallback(opHash);
            showSuccessToast('Sent successfully');
          },
          error => showErrorToast(error.message)
        ),

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
      ).subscribe(([value, successCallback]) => value !== undefined && successCallback(value))
    ];

    return () => void subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [
    dispatch,
    createBiometricsKeys$,
    importWallet$,
    revealSecretKey$,
    createHdAccount$,
    hdAccounts.length,
    goBack,
    revealSeedPhrase$,
    send$
  ]);

  const createBiometricsKeys = () => createBiometricsKeys$.next();
  const importWallet = (seedPhrase: string, password: string) => importWallet$.next({ seedPhrase, password });
  const send = (payload: SendParams) => send$.next(payload);
  const createHdAccount = (name: string) => createHdAccount$.next(name);

  const revealSecretKey = (params: RevealSecretKeyParams) => revealSecretKey$.next(params);
  const revealSeedPhrase = (params: RevealSeedPhraseParams) => revealSeedPhrase$.next(params);

  return { createBiometricsKeys, importWallet, createHdAccount, revealSecretKey, revealSeedPhrase, send };
};
