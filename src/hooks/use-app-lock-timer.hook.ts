import { useRef } from 'react';

import { useAppLock } from '../shelter/use-app-lock.hook';
import { useAppStateStatus } from './use-app-state-status.hook';

const SHOW_ENTER_PASSWORD_SCREEN_DELAY = 3 * 60 * 1000;

export const useAppLockTimer = () => {
  const changedToBackgroundStateMoment = useRef<Date>(new Date());
  const { lock } = useAppLock();

  useAppStateStatus({
    onAppActiveState: () => {
      if (new Date().getTime() - changedToBackgroundStateMoment.current.getTime() > SHOW_ENTER_PASSWORD_SCREEN_DELAY) {
        lock();
      }
    },
    onAppBackgroundState: () => {
      changedToBackgroundStateMoment.current = new Date();
    }
  });
};
