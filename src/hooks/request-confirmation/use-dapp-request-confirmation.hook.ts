import { BeaconRequestOutputMessage } from '@airgap/beacon-sdk';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ObservableInput } from 'rxjs';

import { Action } from 'src/interfaces/action.interface';
import { abortRequestAction } from 'src/store/d-apps/d-apps-actions';

import { useRequestConfirmation } from './use-request-confirmation.hook';

export const useDappRequestConfirmation = <T, O extends ObservableInput<Action>>(
  message: BeaconRequestOutputMessage,
  project: (value: T, index: number) => O
) => {
  const dispatch = useDispatch();

  const requestConfirmation = useRequestConfirmation(project);

  useEffect(
    () => () => void (!requestConfirmation.isConfirmed.current && dispatch(abortRequestAction(message.id))),
    []
  );

  return requestConfirmation;
};
