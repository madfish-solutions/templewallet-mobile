import { useNavigation as useUntypedNavigation, NavigationProp } from '@react-navigation/native';

import { ModalsParamList } from './modals.enum';
import { ScreensParamList } from './screens.enum';

export const useNavigation = () => useUntypedNavigation<NavigationProp<ScreensParamList & ModalsParamList>>();
