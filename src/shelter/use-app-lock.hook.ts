import { noop } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { showErrorToast } from '../toast/toast.utils';
import { Shelter } from './shelter';

export const useAppLock = () => {
  const [biometricKeysExist, setBiometricKeysExist] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const unlock$ = useMemo(() => new Subject<string>(), []);
  const unlockWithBiometry$ = useMemo(() => new Subject<string>(), []);

  const lock = () => Shelter.lockApp();
  const unlock = (password: string) => unlock$.next(password);
  const unlockWithBiometry = () => unlockWithBiometry$.next();

  useEffect(() => {
    ReactNativeBiometrics.biometricKeysExist().then(({ keysExist }) => setBiometricKeysExist(keysExist));

    const subscriptions = [
      Shelter._isLocked$.subscribe(value => setIsLocked(value)),
      unlock$
        .pipe(switchMap(password => Shelter.unlockApp$(password)))
        .subscribe(success => !success && showErrorToast('Wrong password', 'Please, try again')),
      unlockWithBiometry$
        .pipe(switchMap(() => Shelter.unlockAppWithBiometry$()))
        .subscribe(noop, error => showErrorToast('Error', error.message))
    ];

    return () => void subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [unlock$]);

  return { isLocked, lock, unlock, unlockWithBiometry, biometricKeysExist };
};
