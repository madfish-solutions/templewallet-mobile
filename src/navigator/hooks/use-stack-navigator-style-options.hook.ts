import { StackNavigationOptions } from '@react-navigation/stack';
import { useMemo } from 'react';

import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { generateShadow } from 'src/styles/generate-shadow';
import { useColors } from 'src/styles/use-colors';

export const useStackNavigatorStyleOptions = (): StackNavigationOptions => {
  const colors = useColors();

  return useMemo(
    () => ({
      headerStyle: {
        ...generateShadow(1, colors.lines),
        backgroundColor: colors.navigation,
        borderBottomWidth: DEFAULT_BORDER_WIDTH,
        borderBottomColor: colors.lines
      },
      headerTitleStyle: { color: colors.black },
      cardStyle: { backgroundColor: colors.pageBG }
    }),
    [colors]
  );
};
