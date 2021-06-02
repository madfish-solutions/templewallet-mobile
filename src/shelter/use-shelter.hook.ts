import { InMemorySigner } from '@taquito/signer';
import { useCallback, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { merge, of, pipe, Subject, throwError } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import { EventFn } from '../config/general';
import { EstimateInterface } from '../interfaces/estimate.interface';
import { useNavigation } from '../navigator/use-navigation.hook';
import { addHdAccountAction, setSelectedAccountAction } from '../store/wallet/wallet-actions';
import { useHdAccountsListSelector } from '../store/wallet/wallet-selectors';
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
            dispatch(addHdAccountAction(publicData));
            goBack();
          }
        }),

      send$
        .pipe(
          switchMap(data =>
            Shelter.revealSecretKey$(data.from).pipe(
              switchMap(value => (value === undefined ? throwError('Failed to reveal private key') : of(value))),
              map((privateKey): [string, SendParams] => [privateKey, data])
            )
          ),
          withLatestFrom(tezos$),
          switchMap(([[privateKey, { params }], tezos]) => {
            tezos.setProvider({
              signer: new InMemorySigner(privateKey)
            });

            if (params instanceof Array) {
              const batch = tezos.wallet.batch(params);

              return batch.send();
            }

            switch (params.kind) {
              case 'origination':
                return tezos.wallet.originate(params).send();
              case 'delegation':
                return tezos.wallet.setDelegate(params).send();
              case 'transaction':
                return tezos.wallet.transfer(params).send();
              default:
                return throwError('Params of this kind are not supported yet');
            }
          })
        )
        .subscribe(() => Alert.alert('Transaction sent', '', [{ text: 'OK' }])),

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
  const estimate = useCallback(async (payload: EstimateInterface) => {
    const [[privateKey, { params }], tezos] = await pipe(
      switchMap((data: EstimateInterface) =>
        Shelter.revealSecretKey$(data.from).pipe(
          switchMap(value => (value === undefined ? throwError('Failed to reveal private key') : of(value))),
          map((privateKey): [string, EstimateInterface] => [privateKey, data])
        )
      ),
      withLatestFrom(tezos$)
    )(of(payload)).toPromise();

    tezos.setProvider({
      signer: new InMemorySigner(privateKey)
    });

    if (params instanceof Array) {
      return tezos.estimate.batch(params);
    }

    switch (params.kind) {
      case 'origination':
        return [await tezos.estimate.originate(params)];
      case 'delegation':
        return [await tezos.estimate.setDelegate(params)];
      case 'transaction':
        return [await tezos.estimate.transfer(params)];
      default:
        throw new Error('Params of this kind are not supported yet');
    }
  }, []);
  const createHdAccount = (name: string) => createHdAccount$.next(name);

  const revealSecretKey = (params: RevealSecretKeyParams) => revealSecretKey$.next(params);
  const revealSeedPhrase = (params: RevealSeedPhraseParams) => revealSeedPhrase$.next(params);

  return { estimate, importWallet, createHdAccount, revealSecretKey, revealSeedPhrase, send };
};
