import { useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ImportAccountPayload, importWalletActions } from '../store/wallet/wallet-actions';
import { generateSeed } from '../utils/keys.util';
import { Shelter } from './shelter';
import { importWalletOperator$ } from './wallet.util';

export const useShelter = () => {
  const dispatch = useDispatch();

  const importWallet$ = useMemo(() => new Subject<ImportAccountPayload>(), []);
  const createWallet$ = useMemo(() => new Subject<string>(), []);
  const revealValue$ = useMemo(() => new Subject<string>(), []);

  useEffect(() => {
    const subscriptions = [
      importWallet$
        .pipe(switchMap(({ seedPhrase, password }) => importWalletOperator$(seedPhrase, password)))
        .subscribe(publicData => dispatch(importWalletActions.success(publicData))),

      createWallet$.subscribe(password => importWallet$.next({ seedPhrase: generateSeed(), password })),

      revealValue$.pipe(switchMap(key => Shelter.revealValue$(key))).subscribe(value => {
        value !== undefined && Alert.alert(value, '', [{ text: 'OK' }]);
      })
    ];
    return () => void subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [createWallet$, dispatch, importWallet$, revealValue$]);

  const importWallet = (seedPhrase: string, password: string) => importWallet$.next({ seedPhrase, password });
  const createWallet = (password: string) => createWallet$.next(password);
  const revealValue = (key: string) => revealValue$.next(key);

  return { importWallet, createWallet, revealValue };
};
