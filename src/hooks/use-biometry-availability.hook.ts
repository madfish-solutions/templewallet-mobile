import { useContext } from 'react';

import { BiometryAvailabilityContext } from '../biometry/biometry-availability-provider';

export const useBiometryAvailability = () => {
  return useContext(BiometryAvailabilityContext);
};
