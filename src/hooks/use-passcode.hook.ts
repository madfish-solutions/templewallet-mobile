import { useCallback, useState } from 'react';
import { isPinOrFingerprintSet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { resetApplicationAction } from '../store/root-state.actions';
import { useAppStateStatus } from './use-app-state-status.hook';

export const usePasscode = () => {
  const dispatch = useDispatch();
  const [isPasscode, setIsPasscode] = useState<null | boolean>(null);

  const isPinOrFingerPrintHandler = useCallback((isPinOrFingerprintSet: boolean) => {
    if (!isPinOrFingerprintSet) {
      dispatch(resetApplicationAction.submit());
      setIsPasscode(false);
    } else {
      setIsPasscode(true);
    }
  }, []);

  const isPinState = () => {
    isPinOrFingerprintSet().then(isPinOrFingerPrintHandler);
  };

  useAppStateStatus(isPinState, isPinState);

  return { isPasscode };
};
