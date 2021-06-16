import { useNavigation as useUntypedNavigation, NavigationProp } from '@react-navigation/native';

import { ModalsParamList } from '../enums/modals.enum';
import { ScreensParamList } from '../enums/screens.enum';
import { StacksParamList } from '../enums/stacks.enum';

export type NavigationParamList = StacksParamList & ScreensParamList & ModalsParamList;

export const useNavigation = () => useUntypedNavigation<NavigationProp<NavigationParamList>>();
