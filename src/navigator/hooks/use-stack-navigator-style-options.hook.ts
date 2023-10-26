import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { useColors } from 'src/styles/use-colors';

export const useStackNavigatorStyleOptions = (): NativeStackNavigationOptions => {
  const colors = useColors();

  return {
    headerBackVisible: false,
    headerStyle: {
      backgroundColor: colors.navigation
    },
    headerTitleStyle: { color: colors.black }
  };
};
