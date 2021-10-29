import { BeaconRequestOutputMessage } from '@airgap/beacon-sdk';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ObservableInput, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Action } from '../../interfaces/action.interface';
import { abortRequestAction } from '../../store/d-apps/d-apps-actions';

export const useRequestConfirmation = <T, O extends ObservableInput<Action>>(
  message: BeaconRequestOutputMessage,
  project: (value: T, index: number) => O
) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const isConfirmed = useRef(false);
  const confirmRequest$ = useMemo(() => new Subject<T>(), []);

  useEffect(() => {
    return () => {
      if (!isConfirmed.current) {
        dispatch(abortRequestAction(message.id));
      }
    };
  }, []);

  useEffect(() => {
    const subscription = confirmRequest$
      .pipe(
        tap(() => setIsLoading(true)),
        switchMap(project)
      )
      .subscribe(
        action => {
          setIsLoading(false);
          isConfirmed.current = true;

          dispatch(action);
        },
        () => {
          setIsLoading(false);
        }
      );

    return () => subscription.unsubscribe();
  }, [confirmRequest$, project]);

  const confirmRequest = (value: T) => confirmRequest$.next(value);

  return {
    confirmRequest,
    isLoading
  };
};
