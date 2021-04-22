import { useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { Subject } from 'rxjs';
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
  const revealValue$ = useMemo(() => new Subject<string>(), []);

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

      revealValue$.pipe(switchMap(key => Shelter.revealValue$(key))).subscribe(value => {
        value !== undefined && Alert.alert(value, '', [{ text: 'OK' }]);
      })
    ];
    return () => void subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [createWallet$, dispatch, importWallet$, revealValue$, createHdAccount$, wallet.hdAccounts.length]);

  const importWallet = (seedPhrase: string, password: string) => importWallet$.next({ seedPhrase, password });
  const createWallet = (password: string) => createWallet$.next(password);
  const createHdAccount = (name: string) => createHdAccount$.next(name);
  const revealValue = (key: string) => revealValue$.next(key);

  return { importWallet, createWallet, createHdAccount, revealValue };
};
