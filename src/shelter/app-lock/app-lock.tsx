import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Subject } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

import { emptyFn } from 'src/config/general';
import { usePasswordDelay } from 'src/hooks/use-password-delay.hook';
import { enterPassword } from 'src/store/security/security-actions';
import { usePasswordAttempt } from 'src/store/security/security-selectors';
import { useCurrentAccountPkhSelector, useHdAccountListSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import { isDefined } from 'src/utils/is-defined';

import { Shelter } from '../shelter';

interface AppLockContextValue {
  isLocked: boolean;
  lock: EmptyFn;
  unlock: SyncFn<string, void>;
  unlockWithBiometry: EmptyFn;
  unlockInProgress: boolean;
}

const AppLockContext = createContext<AppLockContextValue>({
  isLocked: true,
  lock: emptyFn,
  unlock: emptyFn,
  unlockWithBiometry: emptyFn,
  unlockInProgress: false
});

export const useAppLock = () => useContext(AppLockContext);

export const AppLockContextProvider: FCWithChildren = ({ children }) => {
  const [isLocked, setIsLocked] = useState(Shelter.getIsLocked());
  const [unlockInProgress, setUnlockInProgress] = useState(false);
  const dispatch = useDispatch();
  const attempt = usePasswordAttempt();
  const passwordDelay = usePasswordDelay();
  const unlock$ = useMemo(() => new Subject<string>(), []);
  const currentAccountPkh = useCurrentAccountPkhSelector();
  const hdAccounts = useHdAccountListSelector();

  const hdIndex = useMemo(() => {
    const rawIndex = hdAccounts.findIndex(account => account.publicKeyHash === currentAccountPkh);

    return rawIndex >= 0 ? rawIndex : undefined;
  }, [hdAccounts, currentAccountPkh]);

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
      .catch(error => void console.error(error));

    isDefined(password) && unlock(password);
  }, [unlock]);

  const value = useMemo(
    () => ({ isLocked, lock, unlock, unlockWithBiometry, unlockInProgress }),
    [isLocked, lock, unlock, unlockWithBiometry, unlockInProgress]
  );

  useEffect(() => {
    const subscriptions = [
      Shelter.isLocked$.subscribe(value => setIsLocked(value)),
      unlock$
        .pipe(
          tap(() => setUnlockInProgress(true)),
          delay(passwordDelay),
          switchMap(password => Shelter.unlockApp$(password, currentAccountPkh, hdIndex)),
          tap(() => setUnlockInProgress(false))
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
  }, [unlock$, attempt, currentAccountPkh, hdIndex]);

  return <AppLockContext value={value}>{children}</AppLockContext>;
};
