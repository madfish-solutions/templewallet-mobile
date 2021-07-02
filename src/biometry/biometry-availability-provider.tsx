import { noop } from 'lodash';
import React, { createContext, FC, useEffect, useRef, useState } from 'react';
import ReactNativeBiometrics, { BiometryType } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

import { useAppStateVisible } from '../hooks/use-app-state-visible.hook';

type BiometricAvailabilityContextValues = {
  activeBiometryType: Keychain.BIOMETRY_TYPE | null;
  availableBiometryType?: BiometryType;
  biometricKeysExist: boolean;
  setBiometricKeysExist: (newValue: boolean) => void;
  updateBiometryAvailability: () => void;
};

export const BiometryAvailabilityContext = createContext<BiometricAvailabilityContextValues>({
  activeBiometryType: null,
  biometricKeysExist: false,
  setBiometricKeysExist: noop,
  updateBiometryAvailability: noop
});

export const BiometryAvailabilityProvider: FC = ({ children }) => {
  const [activeBiometryType, setActiveBiometryType] = useState<Keychain.BIOMETRY_TYPE | null>(null);
  const [availableBiometryType, setAvailableBiometryType] = useState<BiometryType>();
  const [biometricKeysExist, setBiometricKeysExist] = useState(false);
  const appState = useAppStateVisible();
  const prevAppStateRef = useRef(appState);

  const updateBiometryAvailability = () => {
    Keychain.getSupportedBiometryType()
      .then(biometryType => setActiveBiometryType(biometryType === Keychain.BIOMETRY_TYPE.IRIS ? null : biometryType))
      .catch(noop);
    ReactNativeBiometrics.isSensorAvailable()
      .then(({ biometryType }) => setAvailableBiometryType(biometryType))
      .catch(noop);
    ReactNativeBiometrics.biometricKeysExist()
      .then(({ keysExist }) => setBiometricKeysExist(keysExist))
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
    <BiometryAvailabilityContext.Provider
      value={{
        activeBiometryType,
        availableBiometryType,
        biometricKeysExist,
        setBiometricKeysExist,
        updateBiometryAvailability
      }}>
      {children}
    </BiometryAvailabilityContext.Provider>
  );
};
