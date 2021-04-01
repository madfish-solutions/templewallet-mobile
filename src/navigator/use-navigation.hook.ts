import { useNavigation as useUntypedNavigation, NavigationProp } from '@react-navigation/native';

import { ScreensParamList } from './screens.enum';

export const useNavigation = () => useUntypedNavigation<NavigationProp<ScreensParamList>>();
