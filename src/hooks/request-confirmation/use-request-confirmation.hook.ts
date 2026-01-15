import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EMPTY, ObservableInput, of, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { Action } from 'src/interfaces/action.interface';
import { showErrorToast } from 'src/toast/toast.utils';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { AnalyticsError } from 'src/utils/error-analytics-data.utils';

export const useRequestConfirmation = <T, O extends ObservableInput<Action>>(
  project: (value: T, index: number) => O
) => {
  const { trackErrorEvent } = useAnalytics();
  const dispatch = useDispatch();

  const isConfirmed = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const confirmRequest$ = useMemo(() => new Subject<T>(), []);

  useEffect(() => {
    const subscription = confirmRequest$
      .pipe(
        tap(() => setIsLoading(true)),
        switchMap(value =>
          of(value).pipe(
            switchMap(project),
            tap(() => setIsLoading(false)),
            catchError(err => {
              setIsLoading(false);
              showErrorToast({ description: err.message });

              if (err instanceof AnalyticsError) {
                const { error, additionalProperties, addressesToHide } = err;
                trackErrorEvent('RequestConfirmationError', error, addressesToHide, additionalProperties);
              } else {
                trackErrorEvent('RequestConfirmationError', err, [], { description: err.message });
              }

              return EMPTY;
            })
          )
        )
      )
      .subscribe(action => {
        isConfirmed.current = true;

        dispatch(action);
      });

    return () => subscription.unsubscribe();
  }, [confirmRequest$, project]);

  return {
    confirmRequest: (value: T) => confirmRequest$.next(value),
    isLoading,
    isConfirmed
  };
};
