import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useMemo } from 'react';

import { useColors } from 'src/styles/use-colors';

export const useStackNavigationOptions = () => {
  const colors = useColors();

  return useMemo<NativeStackNavigationOptions>(
    () => ({
      headerBackVisible: false,
      presentation: 'modal',
      cardOverlayEnabled: true,
      gestureEnabled: true,
      cardStyle: {
        backgroundColor: colors.pageBG
      }
    }),
    [colors.pageBG]
  );
};
