import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { emptyFn } from '../config/general';

enum BasicAppStateStatus {
  Active = 'active',
  Inactive = 'inactive',
  Background = 'background'
}

interface AppStateStatusProps {
  onAppActiveState?: EmptyFn;
  onAppInactiveState?: EmptyFn;
  onAppBackgroundState?: EmptyFn;
}

export const useAppStateStatus = ({
  onAppActiveState = emptyFn,
  onAppInactiveState = emptyFn,
  onAppBackgroundState = emptyFn
}: AppStateStatusProps) => {
  const prevAppState = useRef<BasicAppStateStatus>(BasicAppStateStatus.Active);
  const mountedRef = useRef(true);

  const handleAppStateChange = (newAppState: AppStateStatus) => {
    if (!mountedRef.current) {
      return null;
    }

    if (newAppState === prevAppState.current) {
      return null;
    }

    if (newAppState === BasicAppStateStatus.Active) {
      onAppActiveState();
      prevAppState.current = BasicAppStateStatus.Active;
    }

    if (newAppState === BasicAppStateStatus.Inactive) {
      onAppInactiveState();
      prevAppState.current = BasicAppStateStatus.Inactive;
    }

    if (newAppState === BasicAppStateStatus.Background) {
      onAppBackgroundState();
      prevAppState.current = BasicAppStateStatus.Background;
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
