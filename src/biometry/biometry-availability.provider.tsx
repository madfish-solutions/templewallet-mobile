import { noop } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import ReactNativeBiometrics, { BiometryType } from 'react-native-biometrics';

import { useActiveAppEffect } from '../hooks/use-active-app-effect.hook';
import { BiometryAvailabilityContext } from './biometry-availability.context';

const NO_HARDWARE_ERROR = 'BIOMETRIC_ERROR_NO_HARDWARE';

export const BiometryAvailabilityProvider: FC = ({ children }) => {
  const [isHardwareAvailable, setIsHardwareAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<BiometryType>();

  const updateBiometryAvailability = () => {
    ReactNativeBiometrics.isSensorAvailable()
      .then(result => {
        setIsHardwareAvailable(result.error !== NO_HARDWARE_ERROR);
        setBiometryType(result.biometryType);
      })
      .catch(noop);
  };

  useEffect(updateBiometryAvailability, []);
  useActiveAppEffect(updateBiometryAvailability);

  return (
    <BiometryAvailabilityContext.Provider value={{ isHardwareAvailable, biometryType }}>
      {children}
    </BiometryAvailabilityContext.Provider>
  );
};
