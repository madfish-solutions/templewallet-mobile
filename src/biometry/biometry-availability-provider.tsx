import { noop } from 'lodash';
import React, { createContext, FC, useEffect, useState } from 'react';
import ReactNativeBiometrics, { BiometryType } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

type BiometricAvailabilityContextValues = {
  activeBiometryType: Keychain.BIOMETRY_TYPE | null;
  availableBiometryType?: BiometryType;
  biometricKeysExist: boolean;
  setBiometricKeysExist: (newValue: boolean) => void;
};

export const BiometryAvailabilityContext = createContext<BiometricAvailabilityContextValues>({
  activeBiometryType: null,
  biometricKeysExist: false,
  setBiometricKeysExist: noop
});

export const BiometryAvailabilityProvider: FC = ({ children }) => {
  const [activeBiometryType, setActiveBiometryType] = useState<Keychain.BIOMETRY_TYPE | null>(null);
  const [availableBiometryType, setAvailableBiometryType] = useState<BiometryType>();
  const [biometricKeysExist, setBiometricKeysExist] = useState(false);

  useEffect(() => {
    Keychain.getSupportedBiometryType()
      .then(biometryType => setActiveBiometryType(biometryType === Keychain.BIOMETRY_TYPE.IRIS ? null : biometryType))
      .catch(noop);
    ReactNativeBiometrics.isSensorAvailable()
      .then(({ available, biometryType }) => {
        console.log(available, biometryType);
        setAvailableBiometryType(biometryType);
      })
      .catch(console.error);
    ReactNativeBiometrics.biometricKeysExist()
      .then(({ keysExist }) => setBiometricKeysExist(keysExist))
      .catch(noop);
  }, []);

  return (
    <BiometryAvailabilityContext.Provider
      value={{ activeBiometryType, availableBiometryType, biometricKeysExist, setBiometricKeysExist }}>
      {children}
    </BiometryAvailabilityContext.Provider>
  );
};
