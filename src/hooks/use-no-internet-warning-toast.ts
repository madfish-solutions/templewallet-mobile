import { useNetInfo } from '@react-native-community/netinfo';
import { useCallback } from 'react';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { showWarningToast } from 'src/toast/toast.utils';

export const useNoInternetWarningToast = () => {
  const { isConnected } = useNetInfo();

  return useCallback(
    (callback: EmptyFn) => () => {
      if (isConnected !== false) {
        callback();

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
