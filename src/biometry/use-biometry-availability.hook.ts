import { useContext } from 'react';

import { BiometryAvailabilityContext } from './biometry-availability.context';

export const useBiometryAvailability = () => useContext(BiometryAvailabilityContext);
