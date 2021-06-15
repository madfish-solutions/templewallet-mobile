import { useNavigation as useUntypedNavigation, NavigationProp } from '@react-navigation/native';

import { ModalsParamList } from '../enums/modals.enum';
import { ScreensParamList } from '../enums/screens.enum';

export type NavigationParamList = ScreensParamList & ModalsParamList;

export const useNavigation = () => useUntypedNavigation<NavigationProp<NavigationParamList>>();
