import { Shelter } from './shelter';
import { useEffect, useMemo, useState } from 'react';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const useAppLock = () => {
  const [isLocked, setIsLocked] = useState(true);
  const unlock$ = useMemo(() => new Subject<string>(), []);

  const lock = () => Shelter.lockApp();
  const unlock = (password: string) => unlock$.next(password);

  useEffect(() => {
    const subscriptions = [
      Shelter._isLocked$.subscribe(value => setIsLocked(value)),
      unlock$.pipe(switchMap(password => Shelter.unlockApp$(password))).subscribe()
    ];

    return () => void subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [unlock$]);

  return { isLocked, lock, unlock };
};
