import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isIOS, isPad } from 'src/config/system';

// Original: https://github.com/react-navigation/react-navigation/blob/%40react-navigation/stack%406.3.18/packages/elements/src/Header/getDefaultHeaderHeight.tsx
export const useSuggestedHeaderHeight = (modalPresentation: boolean) => {
  const { top: topInset } = useSafeAreaInsets();

  const headerHeight = useMemo(() => {
    if (!isIOS) {
      return 56;
    }

    if (isPad) {
      return modalPresentation ? 56 : 50;
    }

    return modalPresentation ? 56 : 44;
  }, [modalPresentation]);

  return headerHeight + topInset;
};
