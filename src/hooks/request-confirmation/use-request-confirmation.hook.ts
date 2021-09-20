import { BeaconRequestOutputMessage } from '@airgap/beacon-sdk';
import { useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ObservableInput } from 'rxjs/src/internal/types';

import { Action } from '../../interfaces/action.interface';
import { abortRequestAction } from '../../store/d-apps/d-apps-actions';

export const useRequestConfirmation = <T, O extends ObservableInput<Action>>(
  message: BeaconRequestOutputMessage,
  project: (value: T, index: number) => O
) => {
  const dispatch = useDispatch();

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
    const subscription = confirmRequest$.pipe(switchMap(project)).subscribe(action => {
      isConfirmed.current = true;
      dispatch(action);
    });

    return () => subscription.unsubscribe();
  }, [confirmRequest$]);

  return (value: T) => confirmRequest$.next(value);
};
