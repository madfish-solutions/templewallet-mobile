import { useMemo } from 'react';

import { CONSTANT_DELAY_TIME, MAX_PASSWORD_ATTEMPTS, RANDOM_DELAY_TIME } from 'src/config/security';
import { usePasswordAttempt } from 'src/store/security/security-selectors';

export const usePasswordDelay = () => {
  const attempt = usePasswordAttempt();

  return useMemo(
    () => (attempt > MAX_PASSWORD_ATTEMPTS ? Math.random() * RANDOM_DELAY_TIME + CONSTANT_DELAY_TIME : 0),
    [attempt]
  );
};
