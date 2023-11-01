import { DefaultTheme, Theme } from '@react-navigation/native';
import { useMemo } from 'react';

import { useColors } from 'src/styles/use-colors';

export const useNavigationContainerTheme = () => {
  const colors = useColors();

  return useMemo<Theme>(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: colors.navigation
      }
    }),
    [colors.navigation]
  );
};
