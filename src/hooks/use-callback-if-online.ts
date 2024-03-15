import { useNetInfo } from '@react-native-community/netinfo';
import { useCallback, useRef } from 'react';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { showWarningToast } from 'src/toast/toast.utils';

export const useCallbackIfOnline = (callback: EmptyFn) => {
  const { isConnected } = useNetInfo();
  const isConnectedRef = useRef(isConnected);
  isConnectedRef.current = isConnected;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(() => {
    if (!isConnectedRef.current) {
      return void showWarningToast({
        iconName: IconNameEnum.NoConnection,
        description: 'Unavailable network. Please check your internet connection and try again.'
      });
    }

    callbackRef.current();
  }, []);
};
