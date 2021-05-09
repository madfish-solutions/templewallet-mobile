import { InMemorySigner } from '@taquito/signer';
import { useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { merge, of, Subject, throwError } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import { SendInterface } from '../interfaces/send.interface';
import { ScreensEnum } from '../navigator/screens.enum';
import { useNavigation } from '../navigator/use-navigation.hook';
import { addHdAccount } from '../store/wallet/wallet-actions';
import { useWalletSelector } from '../store/wallet/wallet-selectors';
import { generateSeed } from '../utils/keys.util';
import { tezos$ } from '../utils/network/network.util';
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
          switchMap(data =>
            Shelter.revealSecretKey$(data.from).pipe(
              switchMap(value => (value === undefined ? throwError('Failed to reveal private key') : of(value))),
              map((privateKey): [string, SendInterface] => [privateKey, data])
            )
          ),
          withLatestFrom(tezos$),
          switchMap(([[privateKey, data], tezos]) => {
            tezos.setProvider({
              signer: new InMemorySigner(privateKey)
            });

            return tezos.contract.transfer({ to: data.to, amount: data.amount });
          })
        )
        .subscribe(() => Alert.alert('Transaction sent', '', [{ text: 'OK' }])),

      merge(
        revealSecretKey$.pipe(switchMap(publicKeyHash => Shelter.revealSecretKey$(publicKeyHash))),
        revealSeedPhrase$.pipe(
          switchMap(() => Shelter.revealSeedPhrase$()),
          catchError(() => of(undefined))
        )
      ).subscribe(value => value !== undefined && Alert.alert(value, '', [{ text: 'OK' }]))
    ];

    return () => void subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [createWallet$, dispatch, importWallet$, revealSecretKey$, createHdAccount$, wallet.hdAccounts.length]);

  const importWallet = (seedPhrase: string, password: string) => importWallet$.next({ seedPhrase, password });
  const send = (from: string, amount: number, to: string) => send$.next({ from, amount, to });
  const createWallet = (password: string) => createWallet$.next(password);
  const createHdAccount = (name: string) => createHdAccount$.next(name);

  const revealSecretKey = (key: string) => revealSecretKey$.next(key);
  const revealSeedPhrase = () => revealSeedPhrase$.next();

  return { importWallet, createWallet, createHdAccount, revealSecretKey, revealSeedPhrase, send };
};
