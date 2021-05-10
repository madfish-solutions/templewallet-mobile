import { StackNavigationOptions } from '@react-navigation/stack';

import { useColors } from '../styles/use-colors';

type StackNavigatorStyleOptions = Required<
  Pick<StackNavigationOptions, 'headerStyle' | 'headerTitleStyle' | 'cardStyle'>
>;

export const useStackNavigatorStyleOptions = (): StackNavigatorStyleOptions => {
  const colors = useColors();

  return {
    headerStyle: { backgroundColor: colors.navigation },
    headerTitleStyle: { color: colors.black },
    cardStyle: { backgroundColor: colors.pageBG }
  };
};
