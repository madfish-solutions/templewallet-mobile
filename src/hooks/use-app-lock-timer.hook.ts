import { useRef } from 'react';

import { WALLET_AUTOLOCK_TIME } from 'src/config/security';
import { useAppLock } from 'src/shelter/app-lock/app-lock';

import { useAppStateStatus } from './use-app-state-status.hook';

export const useAppLockTimer = () => {
  const changedToBackgroundStateMoment = useRef<Date>(new Date());
  const { lock } = useAppLock();

  useAppStateStatus({
    onAppActiveState: () => {
      if (new Date().getTime() - changedToBackgroundStateMoment.current.getTime() > WALLET_AUTOLOCK_TIME) {
        lock();
      }
      changedToBackgroundStateMoment.current = new Date();
    },
    onAppBackgroundState: () => {
      changedToBackgroundStateMoment.current = new Date();
    }
  });
};
