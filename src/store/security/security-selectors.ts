import { useSelector } from 'react-redux';

import { SecurityRootState } from './security-state';

export const usePasswordTimelock = () =>
  useSelector<SecurityRootState, number>(({ security }) => security.passwordTimelock);

export const usePasswordAttempt = () =>
  useSelector<SecurityRootState, number>(({ security }) => security.passwordAttempt);
