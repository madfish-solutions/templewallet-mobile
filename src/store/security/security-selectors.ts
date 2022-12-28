import { useSelector } from '../selector';

export const usePasswordLockTime = () => useSelector(({ security }) => security.passwordLockTime);

export const usePasswordAttempt = () => useSelector(({ security }) => security.passwordAttempt);

export const useIsForceUpdateNeeded = () => useSelector(({ security }) => security.isForceUpdateNeeded.data);

export const useIsAppCheckFailed = () => useSelector(({ security }) => security.isAppCheckFailed.data);
