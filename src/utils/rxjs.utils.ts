import { useEffect, useMemo } from 'react';
import { Observable, Subject, throwError } from 'rxjs';

export const throwError$ = (message?: string) => throwError(() => new Error(message));

export const useSubjectWithReSubscription$ = <T>(
  buildObservable: (subject: Subject<T>) => Observable<unknown>,
  errorHandler: (error: unknown) => void,
  deps: unknown[]
): Subject<T> => {
  const subject$ = useMemo(() => new Subject<T>(), []);

  const observable$ = useMemo(() => buildObservable(subject$), deps);

  useReSubscription$(observable$, errorHandler);

  return subject$;
};

const useReSubscription$ = (observable$: Observable<unknown>, errorHandler: (error: unknown) => void) =>
  useEffect(() => {
    const buildSubscription = () =>
      observable$.subscribe({
        error: err => {
          subscription.unsubscribe();
          subscription = buildSubscription();
          errorHandler(err);
        }
      });

    let subscription = buildSubscription();

    return () => subscription.unsubscribe();
  }, [observable$, errorHandler]);
