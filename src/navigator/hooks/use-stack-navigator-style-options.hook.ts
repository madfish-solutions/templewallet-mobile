import { StackNavigationOptions } from '@react-navigation/stack';
import { useMemo } from 'react';

import { generateShadow } from 'src/styles/generate-shadow';
import { useColors } from 'src/styles/use-colors';

import { DEFAULT_BORDER_WIDTH } from '../../config/styles';

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
