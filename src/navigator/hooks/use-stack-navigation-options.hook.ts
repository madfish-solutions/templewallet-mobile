import { StackNavigationOptions, TransitionPresets } from '@react-navigation/stack';
import { useMemo } from 'react';

import { useColors } from 'src/styles/use-colors';

export const useStackNavigationOptions = () => {
  const colors = useColors();

  return useMemo<StackNavigationOptions>(
    () => ({
      presentation: 'modal',
      cardOverlayEnabled: true,
      gestureEnabled: true,
      ...TransitionPresets.ModalPresentationIOS,
      cardStyle: {
        backgroundColor: colors.pageBG
      }
    }),
    [colors.pageBG]
  );
};
