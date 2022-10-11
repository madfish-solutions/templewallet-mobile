import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Subject } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

import { usePasswordDelay } from '../hooks/use-password-delay.hook';
import { enterPassword } from '../store/security/security-actions';
import { usePasswordAttempt } from '../store/security/security-selectors';
import { setLoadingAction } from '../store/settings/settings-actions';
import { showErrorToast } from '../toast/toast.utils';
import { isDefined } from '../utils/is-defined';
import { Shelter } from './shelter';

export const useAppLock = () => {
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

  useEffect(() => {
    const subscriptions = [
      Shelter.isLocked$.subscribe(value => setIsLocked(value)),
      unlock$
        .pipe(
          delay(passwordDelay),
          switchMap(password => Shelter.unlockApp$(password))
        )
        .subscribe(success => {
          dispatch(setLoadingAction(false));
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

  return useMemo(() => ({ isLocked, lock, unlock, unlockWithBiometry }), [isLocked, lock, unlock, unlockWithBiometry]);
};
