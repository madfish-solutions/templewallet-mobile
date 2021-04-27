import { InMemorySigner } from '@taquito/signer';
import { useCallback, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { from, merge, Observable, of, Subject, zip } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { sendTezosRequest$ } from '../api.service';
import { ScreensEnum } from '../navigator/screens.enum';
import { useNavigation } from '../navigator/use-navigation.hook';
import { SendInterface } from '../store/types';
import { addHdAccount } from '../store/wallet/wallet-actions';
import { useWalletSelector } from '../store/wallet/wallet-selectors';
import { generateSeed } from '../utils/keys.util';
import { Tezos } from '../utils/tezos.util';
import { Shelter } from './shelter';

export const useShelter = () => {
  const dispatch = useDispatch();
  const wallet = useWalletSelector();
  const { navigate } = useNavigation();

  const importWallet$ = useMemo(() => new Subject<{ seedPhrase: string; password: string }>(), []);
  const send$ = useMemo(() => new Subject<SendInterface>(), []);
  const createWallet$ = useMemo(() => new Subject<string>(), []);
  const createHdAccount$ = useMemo(() => new Subject<string>(), []);
  const revealSecretKey$ = useMemo(() => new Subject<string>(), []);
  const revealSeedPhrase$ = useMemo(() => new Subject(), []);

  const signTaquitoTezos = useCallback(
    (privateKey: string | undefined) => {
      if (privateKey) {
        Tezos.setProvider({
          signer: new InMemorySigner(privateKey)
        });
      }
    },
    [Tezos]
  );

  useEffect(() => {
    const subscriptions = [
      importWallet$
        .pipe(switchMap(({ seedPhrase, password }) => Shelter.importHdAccount$(seedPhrase, password)))
        .subscribe(publicData => {
          if (publicData !== undefined) {
            dispatch(addHdAccount(publicData));
          }
        }),
      createWallet$.subscribe(password => importWallet$.next({ seedPhrase: generateSeed(), password })),
      createHdAccount$
        .pipe(switchMap(name => Shelter.createHdAccount$(name, wallet.hdAccounts.length)))
        .subscribe(publicData => {
          if (publicData !== undefined) {
            dispatch(addHdAccount(publicData));
            navigate(ScreensEnum.Settings);
          }
        }),

      send$
        .pipe(
          switchMap<any, Observable<SendInterface & { privateKey: string }>>(data => {
            return Shelter.revealSecretKey$(data.from).pipe(
              map(privateKey => ({
                ...data,
                privateKey
              }))
            );
          }),
          map(({ privateKey, ...props }) => {
            signTaquitoTezos(privateKey);
            return props;
          }),
          switchMap(data => sendTezosRequest$(data).pipe(map(data => data)))
        )
        .subscribe(() => Alert.alert('Transaction sent', '', [{ text: 'OK' }])),

      merge(
        revealSecretKey$.pipe(switchMap(publicKeyHash => Shelter.revealSecretKey$(publicKeyHash))),
        revealSeedPhrase$.pipe(switchMap(() => Shelter.revealSeedPhrase$()))
      ).subscribe(value => Alert.alert(value ?? 'Empty', '', [{ text: 'OK' }]))
    ];
    return () => void subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [createWallet$, dispatch, importWallet$, revealSecretKey$, createHdAccount$, wallet.hdAccounts.length]);

  const importWallet = (seedPhrase: string, password: string) => importWallet$.next({ seedPhrase, password });
  const send = (from: string, amount: string, to: string) => send$.next({ from, amount, to });
  const createWallet = (password: string) => createWallet$.next(password);
  const createHdAccount = (name: string) => createHdAccount$.next(name);

  const revealSecretKey = (key: string) => revealSecretKey$.next(key);
  const revealSeedPhrase = () => revealSeedPhrase$.next();

  return { importWallet, createWallet, createHdAccount, revealSecretKey, revealSeedPhrase, send };
};
