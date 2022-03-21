import { useState } from 'react';
import { isPinOrFingerprintSet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { resetApplicationAction } from '../store/root-state.actions';
import { useAppStateStatus } from './use-app-state-status.hook';

export const useDevicePasscode = () => {
  const dispatch = useDispatch();
  const [isDevicePasscodeSet, setDevicePasscode] = useState<boolean>(true);

  const isPinState = () => {
    isPinOrFingerprintSet().then((isPinOrFingerprintSet: boolean) => {
      if (!isPinOrFingerprintSet) {
        dispatch(resetApplicationAction.submit());
        setDevicePasscode(false);
      } else {
        setDevicePasscode(true);
      }
    });
  };

  useAppStateStatus(isPinState, isPinState);

  return isDevicePasscodeSet;
};
