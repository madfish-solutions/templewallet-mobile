import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { emptyFn, EmptyFn } from '../config/general';

enum BasicAppStateStatus {
  Active = 'active',
  Inactive = 'inactive',
  Background = 'background'
}

interface AppStateStatusProps {
  onAppActiveState?: EmptyFn;
  onAppBackgroundState?: EmptyFn;
  onAppInactiveState?: EmptyFn;
  onAppSplashScreenHide?: EmptyFn;
  onAppSplashScreenShow?: EmptyFn;
}

export const useAppStateStatus = ({
  onAppActiveState = emptyFn,
  onAppBackgroundState = emptyFn,
  onAppInactiveState = emptyFn,
  onAppSplashScreenShow = emptyFn,
  onAppSplashScreenHide = emptyFn
}: AppStateStatusProps) => {
  const prevAppState = useRef<BasicAppStateStatus>(BasicAppStateStatus.Active);
  const mountedRef = useRef(true);

  const handleAppStateChange = (newAppState: AppStateStatus) => {
    if (!mountedRef.current) {
      return null;
    }
    if (prevAppState.current === BasicAppStateStatus.Active && newAppState === BasicAppStateStatus.Inactive) {
      onAppSplashScreenShow();
      onAppInactiveState();
    }

    if (prevAppState.current === BasicAppStateStatus.Background && newAppState === BasicAppStateStatus.Active) {
      onAppSplashScreenHide();
      onAppActiveState();
    }

    if (prevAppState.current === BasicAppStateStatus.Active && newAppState === BasicAppStateStatus.Active) {
      onAppSplashScreenHide();
    }

    if (prevAppState.current === BasicAppStateStatus.Active && newAppState === BasicAppStateStatus.Background) {
      onAppBackgroundState();
    }

    // Other states are optional on different platforms, so they are ignored
    if (newAppState === BasicAppStateStatus.Active || newAppState === BasicAppStateStatus.Background) {
      prevAppState.current = newAppState as BasicAppStateStatus;
    }
  };

  useEffect(() => {
    onAppActiveState();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const listener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      mountedRef.current = false;
      listener.remove();
    };
  }, []);
};
