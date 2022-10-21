import { useState } from 'react';

import { useAppStateStatus } from './use-app-state-status.hook';

export const useAppSplash = () => {
  const [isSplash, setIsSplash] = useState(false);

  const handleBlur = () => setIsSplash(true);
  const handleFocus = () => setIsSplash(false);

  useAppStateStatus({
    onAppInactiveState: handleBlur,
    onAppBackgroundState: handleBlur,
    onAppActiveState: handleFocus
  });

  return isSplash;
};
