import { noop } from 'lodash';
import React, { createContext, FC, useEffect, useRef, useState } from 'react';
import ReactNativeBiometrics, { BiometryType } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

import { useAppStateVisible } from '../hooks/use-app-state-visible.hook';

type BiometricAvailabilityContextValues = {
  activeBiometryType: Keychain.BIOMETRY_TYPE | null;
  availableBiometryType?: BiometryType;
  biometricKeysExist: boolean;
  createBiometricKeys: () => Promise<void>;
};

export const BiometryAvailabilityContext = createContext<BiometricAvailabilityContextValues>({
  activeBiometryType: null,
  biometricKeysExist: false,
  createBiometricKeys: () => Promise.resolve()
});

export const BiometryAvailabilityProvider: FC = ({ children }) => {
  const [biometryType, setBiometryType] = useState<BiometryType>();
  const [keysExist, setKeysExist] = useState(false);

  const appState = useAppStateVisible();
  const prevAppStateRef = useRef(appState);

  const updateBiometryAvailability = () => {
    ReactNativeBiometrics.isSensorAvailable()
      .then(result => {
        console.log(result);
        setBiometryType(result.biometryType);
      })
      .catch(noop);
    ReactNativeBiometrics.biometricKeysExist()
      .then(result => setKeysExist(result.keysExist))
      .catch(noop);
  };

  const createBiometricKeys = async () => {
    await ReactNativeBiometrics.createKeys();
    setKeysExist(true);
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
        biometryType,
        keysExist,
        createBiometricKeys
      }}>
      {children}
    </BiometryAvailabilityContext.Provider>
  );
};
