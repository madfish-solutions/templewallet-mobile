import { useEffect, useMemo } from 'react';
import { Subject, Subscription, throwError } from 'rxjs';

export const throwError$ = (message?: string) => throwError(() => new Error(message));

export const useSubjectSubscription$ = <T>(
  subscribe: (subject: Subject<T>) => Subscription,
  deps: unknown[]
): Subject<T> => {
  const subject$ = useMemo(() => new Subject<T>(), []);

  useEffect(() => {
    const subscription = subscribe(subject$);

    return () => subscription.unsubscribe();
  }, deps);

  return subject$;
};
