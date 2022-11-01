import React, { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Subject } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

import { EmptyFn, emptyFn, EventFn } from '../../config/general';
import { usePasswordDelay } from '../../hooks/use-password-delay.hook';
import { enterPassword } from '../../store/security/security-actions';
import { usePasswordAttempt } from '../../store/security/security-selectors';
import { hideLoaderAction, showLoaderAction } from '../../store/settings/settings-actions';
import { showErrorToast } from '../../toast/toast.utils';
import { isDefined } from '../../utils/is-defined';
import { Shelter } from '../shelter';

interface AppLockContextValue {
  isLocked: boolean;
  lock: EmptyFn;
  unlock: EventFn<string, void>;
  unlockWithBiometry: EmptyFn;
}

const AppLockContext = createContext<AppLockContextValue>({
  isLocked: true,
  lock: emptyFn,
  unlock: emptyFn,
  unlockWithBiometry: emptyFn
});

export const useAppLock = () => useContext(AppLockContext);

export const AppLockContextProvider: FC = ({ children }) => {
  const [isLocked, setIsLocked] = useState(Shelter.getIsLocked());
  const dispatch = useDispatch();
  const attempt = usePasswordAttempt();
  const passwordDelay = usePasswordDelay();
  const unlock$ = useMemo(() => new Subject<string>(), []);

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

  const value = useMemo(
    () => ({ isLocked, lock, unlock, unlockWithBiometry }),
    [isLocked, lock, unlock, unlockWithBiometry]
  );

  useEffect(() => {
    const subscriptions = [
      Shelter.isLocked$.subscribe(value => setIsLocked(value)),
      unlock$
        .pipe(
          tap(() => dispatch(showLoaderAction())),
          delay(passwordDelay),
          switchMap(password => Shelter.unlockApp$(password)),
          tap(() => dispatch(hideLoaderAction()))
        )
        .subscribe(success => {
          if (success) {
            dispatch(enterPassword.success());

            return true;
          } else {
            dispatch(enterPassword.fail());
            showErrorToast({ description: 'Wrong password, please, try again' });

            return false;
          }
        })
    ];

    return () => void subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [unlock$, attempt]);

  return <AppLockContext.Provider value={value}>{children}</AppLockContext.Provider>;
};
