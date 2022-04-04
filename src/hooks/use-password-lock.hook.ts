import { useEffect, useMemo, useState } from 'react';

import { MAX_PASSWORD_ATTEMPTS, WRONG_PASSWORD_LOCK_TIME } from '../config/security';
import { usePasswordAttempt, usePasswordLockTime } from '../store/security/security-selectors';
import { getTimeLeft } from '../utils/password.util';

export const usePasswordLock = () => {
  const lockTime = usePasswordLockTime();
  const attempt = usePasswordAttempt();
  const lockLevel = WRONG_PASSWORD_LOCK_TIME * Math.floor(attempt / MAX_PASSWORD_ATTEMPTS);
  const [timeleft, setTimeleft] = useState(getTimeLeft(lockTime, lockLevel));
  const isDisabled: boolean = useMemo(() => Date.now() - lockTime <= lockLevel, [lockTime, lockLevel]);

  useEffect(() => {
    const interval = setInterval(() => setTimeleft(getTimeLeft(lockTime, lockLevel)), 1_000);

    return () => {
      clearInterval(interval);
    };
  }, [lockTime, lockLevel]);

  return { timeleft, isDisabled };
};
