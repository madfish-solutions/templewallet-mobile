import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { WRONG_PASSWORD_LOCK_TIME } from '../config/system';
import { setPasswordTimelock } from '../store/security/security-actions';
import { usePasswordAttempt, usePasswordTimelock } from '../store/security/security-selectors';
import { getTimeLeft } from '../utils/password.util';

export const usePasswordLock = () => {
  const dispatch = useDispatch();
  const timelock = usePasswordTimelock();
  const attempt = usePasswordAttempt();
  const lockLevel = WRONG_PASSWORD_LOCK_TIME * Math.floor(attempt / 3);
  const [timeleft, setTimeleft] = useState(getTimeLeft(timelock, lockLevel));
  const isDisabled = useMemo(() => Date.now() - timelock <= lockLevel, [timelock, lockLevel]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - timelock > lockLevel) {
        dispatch(setPasswordTimelock.submit(0));
      }
      setTimeleft(getTimeLeft(timelock, lockLevel));
    }, 1_000);

    return () => {
      clearInterval(interval);
    };
  }, [timelock, lockLevel]);

  return { timeleft, isDisabled };
};
