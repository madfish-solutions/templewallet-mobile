import { StackNavigationOptions } from '@react-navigation/stack';

import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';

type StackNavigatorStyleOptions = Required<
  Pick<StackNavigationOptions, 'headerStyle' | 'headerTitleStyle' | 'cardStyle'>
>;

export const useStackNavigatorStyleOptions = (): StackNavigatorStyleOptions => {
  const colors = useColors();

  return {
    headerStyle: {
      backgroundColor: colors.navigation,
      borderBottomWidth: formatSize(0.5),
      borderBottomColor: colors.lines
    },
    headerTitleStyle: { color: colors.black },
    cardStyle: { backgroundColor: colors.pageBG }
  };
};
