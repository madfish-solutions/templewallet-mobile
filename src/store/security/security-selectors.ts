import { useSelector } from 'react-redux';

import { SecurityRootState } from './security-state';

export const usePasswordLockTime = () =>
  useSelector<SecurityRootState, number>(({ security }) => security.passwordLockTime);

export const usePasswordAttempt = () =>
  useSelector<SecurityRootState, number>(({ security }) => security.passwordAttempt);

export const useIsForceUpdateNeeded = () =>
  useSelector<SecurityRootState, boolean>(({ security }) => security.isForceUpdateNeeded.data);

export const useIsAppCheckFailed = () =>
  useSelector<SecurityRootState, boolean>(({ security }) => security.isAppCheckFailed.data);

export const useIsSeedPhraseVerified = () =>
  useSelector<SecurityRootState, boolean>(({ security }) => security.isSeedPhraseVerified);
