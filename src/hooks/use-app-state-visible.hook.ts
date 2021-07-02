import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useAppStateVisible = () => {
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    setAppStateVisible(nextAppState);
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  return appStateVisible;
};
