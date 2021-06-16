import { InMemorySigner } from '@taquito/signer';
import { WalletParamsWithKind } from '@taquito/taquito';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { merge, of, Subject, throwError } from 'rxjs';
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

export const useShelter = () => {
  const dispatch = useDispatch();
  const hdAccounts = useHdAccountsListSelector();
  const { goBack } = useNavigation();

  const importWallet$ = useMemo(() => new Subject<ImportWalletParams>(), []);
  const send$ = useMemo(() => new Subject<SendParams>(), []);
  const createHdAccount$ = useMemo(() => new Subject<string>(), []);
  const revealSecretKey$ = useMemo(() => new Subject<RevealSecretKeyParams>(), []);
  const revealSeedPhrase$ = useMemo(() => new Subject<RevealSeedPhraseParams>(), []);

  useEffect(() => {
    const subscriptions = [
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
          switchMap(({ publicKeyHash, opParams }) =>
            Shelter.revealSecretKey$(publicKeyHash).pipe(
              switchMap(value => (value === undefined ? throwError('Failed to reveal private key') : of(value))),
              map((privateKey): [string, WalletParamsWithKind[]] => [privateKey, opParams])
            )
          ),
          withLatestFrom(tezos$),
          switchMap(async ([[privateKey, opParams], tezos]) => {
            tezos.setProvider({
              signer: new InMemorySigner(privateKey)
            });

            return tezos.wallet.batch(opParams).send();
          })
        )
        .subscribe(
          ({ opHash }) => {
            console.log(opHash);
            // dispatch(pushActivityAction(activityGroup));
            showSuccessToast('Sent successfully');
            goBack();
          },
          error => {
            showErrorToast(`Error while sending operations: ${error.message}`);
            goBack();
          }
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
    importWallet$,
    revealSecretKey$,
    createHdAccount$,
    hdAccounts.length,
    goBack,
    revealSeedPhrase$,
    send$
  ]);

  const importWallet = (seedPhrase: string, password: string) => importWallet$.next({ seedPhrase, password });
  const send = (payload: SendParams) => send$.next(payload);
  const createHdAccount = (name: string) => createHdAccount$.next(name);

  const revealSecretKey = (params: RevealSecretKeyParams) => revealSecretKey$.next(params);
  const revealSeedPhrase = (params: RevealSeedPhraseParams) => revealSeedPhrase$.next(params);

  return { importWallet, createHdAccount, revealSecretKey, revealSeedPhrase, send };
};
