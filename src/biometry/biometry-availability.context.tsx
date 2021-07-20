import { createContext } from 'react';
import { BiometryType } from 'react-native-biometrics';

interface BiometricAvailabilityContextValues {
  isHardwareAvailable: boolean;
  biometryType?: BiometryType;
}

export const BiometryAvailabilityContext = createContext<BiometricAvailabilityContextValues>({
  isHardwareAvailable: false,
  biometryType: undefined
});
