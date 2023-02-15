import { StackNavigationOptions } from '@react-navigation/stack';

import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';
import { useColors } from 'src/styles/use-colors';

export const useStackNavigatorStyleOptions = (): StackNavigationOptions => {
  const colors = useColors();

  return {
    headerStyle: {
      ...generateShadow(1, colors.lines),
      backgroundColor: colors.navigation,
      borderBottomWidth: formatSize(0.5),
      borderBottomColor: colors.lines
    },
    headerTitleStyle: { color: colors.black },
    cardStyle: { backgroundColor: colors.pageBG }
  };
};
