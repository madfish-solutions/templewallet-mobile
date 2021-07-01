import { useEffect, useMemo, useState } from 'react';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { showErrorToast } from '../toast/toast.utils';
import { Shelter } from './shelter';

export const useAppLock = () => {
  const [isLocked, setIsLocked] = useState(true);
  const unlock$ = useMemo(() => new Subject<string>(), []);
  const unlockWithBiometry$ = useMemo(() => new Subject(), []);

  const lock = () => Shelter.lockApp();
  const unlock = (password: string) => unlock$.next(password);
  const unlockWithBiometry = () => unlockWithBiometry$.next();

  useEffect(() => {
    const subscriptions = [
      Shelter._isLocked$.subscribe(value => setIsLocked(value)),
      unlock$
        .pipe(switchMap(password => Shelter.unlockApp$(password)))
        .subscribe(success => !success && showErrorToast('Wrong password', 'Please, try again')),
      unlockWithBiometry$.pipe(switchMap(() => Shelter.unlockAppWithBiometry$())).subscribe(result => {
        if (result instanceof Error && result.message !== 'User cancellation') {
          showErrorToast('Error', result.message);
        }
      })
    ];

    return () => void subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [unlock$]);

  return { isLocked, lock, unlock, unlockWithBiometry };
};
