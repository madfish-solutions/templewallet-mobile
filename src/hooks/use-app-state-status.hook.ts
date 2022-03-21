import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { emptyFn, EmptyFn } from '../config/general';

enum BasicAppStateStatus {
  Active = 'active',
  Background = 'background',
  Inactive = 'inactive'
}

interface AppStateStatusProps {
  onAppActiveState?: EmptyFn;
  onAppBackgroundState?: EmptyFn;
  onAppInactiveState?: EmptyFn;
}

export const useAppStateStatus = ({
  onAppActiveState = emptyFn,
  onAppBackgroundState = emptyFn,
  onAppInactiveState = emptyFn
}: AppStateStatusProps) => {
  const prevAppState = useRef<BasicAppStateStatus>(BasicAppStateStatus.Active);

  const handleAppStateChange = (newAppState: AppStateStatus) => {
    if (prevAppState.current !== BasicAppStateStatus.Inactive && newAppState === BasicAppStateStatus.Inactive) {
      onAppInactiveState();
    }

    if (prevAppState.current === BasicAppStateStatus.Background && newAppState === BasicAppStateStatus.Active) {
      onAppActiveState();
    }

    if (prevAppState.current === BasicAppStateStatus.Active && newAppState === BasicAppStateStatus.Background) {
      onAppBackgroundState();
    }

    // Other states are optional on different platforms, so they are ignored
    if (newAppState === BasicAppStateStatus.Active || newAppState === BasicAppStateStatus.Background) {
      prevAppState.current = newAppState as BasicAppStateStatus;
    }
  };

  useEffect(onAppActiveState, []);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => AppState.removeEventListener('change', handleAppStateChange);
  }, []);
};
