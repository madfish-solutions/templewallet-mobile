import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { EmptyFn } from '../config/general';

export const useActiveAppEffect = (effect: EmptyFn) => {
  const [appStateStatus, setAppStateStatus] = useState(AppState.currentState);
  const prevAppStateRef = useRef(appStateStatus);

  const handleAppStateChange = (newAppStateStatus: AppStateStatus) => setAppStateStatus(newAppStateStatus);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    const prevAppState = prevAppStateRef.current;
    if (prevAppState.match(/inactive|background/) && appStateStatus === 'active') {
      effect();
    }
    prevAppStateRef.current = appStateStatus;
  }, [appStateStatus]);
};
