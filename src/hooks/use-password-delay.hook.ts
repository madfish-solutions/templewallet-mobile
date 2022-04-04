import { MAX_PASSWORD_ATTEMPTS } from '../config/security';
import { usePasswordAttempt } from '../store/security/security-selectors';

export const usePasswordDelay = () => {
  const attempt = usePasswordAttempt();

  return attempt > MAX_PASSWORD_ATTEMPTS ? Math.random() * 2000 + 1000 : 0;
};
