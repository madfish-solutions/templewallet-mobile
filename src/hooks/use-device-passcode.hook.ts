import { useState } from 'react';
import { isPinOrFingerprintSet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { resetApplicationAction } from '../store/root-state.actions';

import { useAppStateStatus } from './use-app-state-status.hook';

export const useDevicePasscode = () => {
  const dispatch = useDispatch();
  const [isDevicePasscodeSet, setDevicePasscode] = useState<boolean>(true);

  const isPinState = () => {
    isPinOrFingerprintSet().then((isSecured: boolean) => {
      if (isSecured) {
        setDevicePasscode(true);
      } else {
        dispatch(resetApplicationAction.submit());
        setDevicePasscode(false);
      }
    });
  };

  useAppStateStatus({ onAppActiveState: isPinState, onAppBackgroundState: isPinState });

  return isDevicePasscodeSet;
};
