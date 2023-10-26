import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

//import { formatSize } from 'src/styles/format-size';
//import { generateShadow } from 'src/styles/generate-shadow';
import { useColors } from 'src/styles/use-colors';

export const useStackNavigatorStyleOptions = (): NativeStackNavigationOptions => {
  const colors = useColors();

  return {
    headerBackVisible: false,
    headerStyle: {
      //...generateShadow(1, colors.lines),
      backgroundColor: colors.navigation
      //borderBottomWidth: formatSize(0.5),
      //borderBottomColor: colors.lines
    },
    headerTitleStyle: { color: colors.black }
    //cardStyle: { backgroundColor: colors.pageBG }
  };
};
