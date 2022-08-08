import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { emptyFn, EmptyFn } from '../config/general';

enum BasicAppStateStatus {
  Active = 'active',
  Inactive = 'inactive',
  Background = 'background'
}

interface AppStateStatusProps {
  isLogged?: boolean;
  onAppActiveState?: EmptyFn;
  onAppInactiveState?: EmptyFn;
  onAppBackgroundState?: EmptyFn;
}

export const useAppStateStatus = ({
  isLogged = false,
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

    if (isLogged) {
      console.log(newAppState, prevAppState.current);
    }

    if (newAppState === prevAppState.current) {
      return null;
    }

    if (newAppState === BasicAppStateStatus.Active) {
      if (isLogged) {
        console.log('onAppActiveState();');
      }
      onAppActiveState();
      prevAppState.current = BasicAppStateStatus.Active;
    }

    if (newAppState === BasicAppStateStatus.Inactive) {
      if (isLogged) {
        console.log('onAppInactiveState();');
      }
      onAppInactiveState();
      prevAppState.current = BasicAppStateStatus.Inactive;
    }

    if (newAppState === BasicAppStateStatus.Background) {
      if (isLogged) {
        console.log('onAppBackgroundState();');
      }
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
