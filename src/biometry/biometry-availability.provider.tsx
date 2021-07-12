import { noop } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import ReactNativeBiometrics, { BiometryType } from 'react-native-biometrics';

import { useAppStateVisible } from '../hooks/use-app-state-visible.hook';
import { BiometryAvailabilityContext } from './biometry-availability.context';

const NO_HARDWARE_ERROR = 'BIOMETRIC_ERROR_NO_HARDWARE';

export const BiometryAvailabilityProvider: FC = ({ children }) => {
  const [isHardwareAvailable, setIsHardwareAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<BiometryType>();

  const appState = useAppStateVisible();
  const prevAppStateRef = useRef(appState);

  const updateBiometryAvailability = () => {
    ReactNativeBiometrics.isSensorAvailable()
      .then(result => {
        setIsHardwareAvailable(result.error !== NO_HARDWARE_ERROR);
        setBiometryType(result.biometryType);
      })
      .catch(noop);
  };

  useEffect(() => updateBiometryAvailability(), []);

  useEffect(() => {
    const prevAppState = prevAppStateRef.current;
    if (prevAppState.match(/inactive|background/) && appState === 'active') {
      updateBiometryAvailability();
    }
    prevAppStateRef.current = appState;
  }, [appState]);

  return (
    <BiometryAvailabilityContext.Provider value={{ isHardwareAvailable, biometryType }}>
      {children}
    </BiometryAvailabilityContext.Provider>
  );
};
