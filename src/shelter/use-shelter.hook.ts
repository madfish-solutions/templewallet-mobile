import { useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { merge, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ScreensEnum } from '../navigator/screens.enum';
import { useNavigation } from '../navigator/use-navigation.hook';
import { addHdAccount } from '../store/wallet/wallet-actions';
import { useWalletSelector } from '../store/wallet/wallet-selectors';
import { generateSeed } from '../utils/keys.util';
import { Shelter } from './shelter';

export const useShelter = () => {
  const dispatch = useDispatch();
  const wallet = useWalletSelector();
  const { navigate } = useNavigation();

  const importWallet$ = useMemo(() => new Subject<{ seedPhrase: string; password: string }>(), []);
  const createWallet$ = useMemo(() => new Subject<string>(), []);
  const createHdAccount$ = useMemo(() => new Subject<string>(), []);
  const revealSecretKey$ = useMemo(() => new Subject<string>(), []);
  const revealSeedPhrase$ = useMemo(() => new Subject(), []);

  useEffect(() => {
    const subscriptions = [
      importWallet$
        .pipe(switchMap(({ seedPhrase, password }) => Shelter.importHdAccount$(seedPhrase, password)))
        .subscribe(publicData => dispatch(addHdAccount(publicData))),
      createWallet$.subscribe(password => importWallet$.next({ seedPhrase: generateSeed(), password })),
      createHdAccount$
        .pipe(switchMap(name => Shelter.createHdAccount$(name, wallet.hdAccounts.length)))
        .subscribe(publicData => {
          dispatch(addHdAccount(publicData));
          navigate(ScreensEnum.Settings);
        }),

      merge(
        revealSecretKey$.pipe(switchMap(publicKeyHash => Shelter.revealSecretKey$(publicKeyHash))),
        revealSeedPhrase$.pipe(switchMap(() => Shelter.revealSeedPhrase$()))
      ).subscribe(value => Alert.alert(value, '', [{ text: 'OK' }]))
    ];
    return () => void subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [createWallet$, dispatch, importWallet$, revealSecretKey$, createHdAccount$, wallet.hdAccounts.length]);

  const importWallet = (seedPhrase: string, password: string) => importWallet$.next({ seedPhrase, password });
  const createWallet = (password: string) => createWallet$.next(password);
  const createHdAccount = (name: string) => createHdAccount$.next(name);

  const revealSecretKey = (key: string) => revealSecretKey$.next(key);
  const revealSeedPhrase = () => revealSeedPhrase$.next();

  return { importWallet, createWallet, createHdAccount, revealSecretKey, revealSeedPhrase };
};
