import { StackNavigationOptions } from '@react-navigation/stack';
import { useMemo } from 'react';

import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { useSuggestedHeaderHeight } from 'src/hooks/use-suggested-header-height.hook';
import { generateShadow } from 'src/styles/generate-shadow';
import { useColors } from 'src/styles/use-colors';

export const useStackNavigatorStyleOptions = (): StackNavigationOptions => {
  const colors = useColors();
  const headerHeight = useSuggestedHeaderHeight(false);

  return useMemo(
    () => ({
      headerStyle: {
        ...generateShadow(1, colors.lines),
        backgroundColor: colors.navigation,
        borderBottomWidth: DEFAULT_BORDER_WIDTH,
        borderBottomColor: colors.lines,
        height: headerHeight
      },
      headerTitleStyle: { color: colors.black },
      cardStyle: { backgroundColor: colors.pageBG }
    }),
    [colors, headerHeight]
  );
};
