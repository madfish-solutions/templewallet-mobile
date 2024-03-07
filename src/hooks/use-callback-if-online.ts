import { useNetInfo } from '@react-native-community/netinfo';
import { useCallback } from 'react';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { showWarningToast } from 'src/toast/toast.utils';

export const useCallbackIfOnline = () => {
  const { isConnected } = useNetInfo();

  return useCallback(
    (onOnline: EmptyFn) => () => {
      if (isConnected !== false) {
        onOnline();

        return;
      }

      showWarningToast({
        iconName: IconNameEnum.NoConnection,
        description: 'Unavailable network. Please check your internet connection and try again.'
      });
    },
    [isConnected]
  );
};
