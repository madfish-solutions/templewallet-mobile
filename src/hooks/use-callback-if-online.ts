import { useNetInfo } from '@react-native-community/netinfo';
import { useCallback, useRef } from 'react';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { emptyFn } from 'src/config/general';
import { showWarningToast } from 'src/toast/toast.utils';

export const useCallbackIfOnline = () => {
  const { isConnected } = useNetInfo();

  const onOnlineRef = useRef<EmptyFn>(emptyFn);

  const updateOnOnline = useCallback((callback: EmptyFn) => {
    if (onOnlineRef.current !== callback) {
      onOnlineRef.current = callback;
    }
  }, []);

  return useCallback(
    (onOnline: EmptyFn) => {
      updateOnOnline(onOnline);

      return () => {
        if (isConnected !== false) {
          onOnlineRef.current();

          return;
        }

        showWarningToast({
          iconName: IconNameEnum.NoConnection,
          description: 'Unavailable network. Please check your internet connection and try again.'
        });
      };
    },
    [isConnected, updateOnOnline]
  );
};
