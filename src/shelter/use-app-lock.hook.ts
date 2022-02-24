import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Subject } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

import { setPasswordTimelock } from '../store/security/security-actions';
import { usePasswordAttempt, usePasswordTimelock } from '../store/security/security-selectors';
import { showErrorToast } from '../toast/toast.utils';
import { isDefined } from '../utils/is-defined';
import { Shelter } from './shelter';

const LOCK_TIME = 5_000;
const LAST_ATTEMPT = 3;

const checkTime = (i: number) => (i < 10 ? '0' + i : i);

const getTimeLeft = (start: number, end: number) => {
  const isPositiveTime = start + end - Date.now() < 0 ? 0 : start + end - Date.now();
  const diff = isPositiveTime / 1000;
  const seconds = Math.floor(diff % 60);
  const minutes = Math.floor(diff / 60);

  return `${checkTime(minutes)}:${checkTime(seconds)}`;
};

export const useAppLock = () => {
  const [isLocked, setIsLocked] = useState(Shelter.getIsLocked());
  const dispatch = useDispatch();
  const attempt = usePasswordAttempt();
  const timelock = usePasswordTimelock();
  const lockLevel = LOCK_TIME * Math.floor(attempt / 3);
  const [timeleft, setTimeleft] = useState(getTimeLeft(timelock, lockLevel));
  const unlock$ = useMemo(() => new Subject<string>(), []);
  // const setAttempt = useCallback((n: number) => dispatch(setPasswordAttempts(n)), []);
  const setTimeLock = useCallback((n: number) => dispatch(setPasswordTimelock(n)), []);
  // const isDisabled = useMemo(() => Date.now() - timelock <= lockLevel, [timelock, lockLevel]);

  const lock = useCallback(() => Shelter.lockApp(), []);
  const unlock = useCallback((password: string) => unlock$.next(password), [unlock$]);
  const unlockWithBiometry = useCallback(async () => {
    const password = await Shelter.getBiometryPassword()
      .then(rawKeychainData => {
        if (rawKeychainData !== false) {
          return JSON.parse(rawKeychainData.password) as string;
        }

        return undefined;
      })
      .catch(() => undefined);

    isDefined(password) && unlock(password);
  }, [unlock]);

  useEffect(() => {
    const subscriptions = [
      Shelter.isLocked$.subscribe(value => setIsLocked(value)),
      unlock$
        .pipe(
          delay(attempt > LAST_ATTEMPT ? Math.random() * 2000 + 1000 : 0),
          switchMap(password => Shelter.unlockApp$(password))
        )
        .subscribe(success => {
          console.log(success);
          if (success) {
            // setAttempt(1);

            return true;
          } else {
            // if (attempt >= LAST_ATTEMPT) {
            //   setTimeLock(Date.now());
            // }
            // setAttempt(attempt + 1);
            // setTimeleft(getTimeLeft(Date.now(), LOCK_TIME * Math.floor((attempt + 1) / 3)));
            showErrorToast({ description: 'Wrong password, please, try again' });

            return false;
          }
        })
    ];

    return () => void subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [unlock$, attempt]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - timelock > lockLevel) {
        setTimeLock(0);
      }
      setTimeleft(getTimeLeft(timelock, lockLevel));
    }, 1_000);

    return () => {
      clearInterval(interval);
    };
  }, [timelock, lockLevel, setTimeLock]);

  return useMemo(
    () => ({ isLocked, lock, unlock, unlockWithBiometry, timeleft }),
    [isLocked, lock, unlock, unlockWithBiometry, timeleft]
  );
};
