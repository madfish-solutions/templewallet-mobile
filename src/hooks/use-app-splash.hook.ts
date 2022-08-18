import { show, hide } from 'react-native-bootsplash';

import { useAppStateStatus } from './use-app-state-status.hook';

export const useAppSplash = () => {
  useAppStateStatus({
    onAppInactiveState: show,
    onAppBackgroundState: show,
    onAppActiveState: hide
  });
};
