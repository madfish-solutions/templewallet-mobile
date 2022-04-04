import { useSelector } from 'react-redux';

import { SecurityRootState } from './security-state';

export const usePasswordLockTime = () =>
  useSelector<SecurityRootState, number>(({ security }) => security.passwordLockTime);

export const usePasswordAttempt = () =>
  useSelector<SecurityRootState, number>(({ security }) => security.passwordAttempt);
