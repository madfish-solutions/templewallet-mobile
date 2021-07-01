import { noop } from 'lodash';
import React, { createContext, FC, useEffect, useState } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

type BiometricAvailabilityContextValues = {
  availableBiometryType: Keychain.BIOMETRY_TYPE | null;
  biometricKeysExist: boolean;
  setBiometricKeysExist: (newValue: boolean) => void;
};

export const BiometryAvailabilityContext = createContext<BiometricAvailabilityContextValues>({
  availableBiometryType: null,
  biometricKeysExist: false,
  setBiometricKeysExist: noop
});

export const BiometryAvailabilityProvider: FC = ({ children }) => {
  const [availableBiometryType, setAvailableBiometryType] = useState<Keychain.BIOMETRY_TYPE | null>(null);
  const [biometricKeysExist, setBiometricKeysExist] = useState(false);

  useEffect(() => {
    Keychain.getSupportedBiometryType()
      .then(biometryType =>
        setAvailableBiometryType(biometryType === Keychain.BIOMETRY_TYPE.IRIS ? null : biometryType)
      )
      .catch(noop);
    ReactNativeBiometrics.biometricKeysExist()
      .then(({ keysExist }) => setBiometricKeysExist(keysExist))
      .catch(noop);
  }, []);

  return (
    <BiometryAvailabilityContext.Provider value={{ availableBiometryType, biometricKeysExist, setBiometricKeysExist }}>
      {children}
    </BiometryAvailabilityContext.Provider>
  );
};
