import { CONSTANT_DELAY_TIME, MAX_PASSWORD_ATTEMPTS, RANDOM_DELAY_TIME } from '../config/security';
import { usePasswordAttempt } from '../store/security/security-selectors';

export const usePasswordDelay = () => {
  const attempt = usePasswordAttempt();

  return attempt > MAX_PASSWORD_ATTEMPTS ? Math.random() * RANDOM_DELAY_TIME + CONSTANT_DELAY_TIME : 0;
};
