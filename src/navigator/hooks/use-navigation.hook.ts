import {
  useNavigation as useUntypedNavigation,
  useNavigationState as useUntypedNavigationState,
  NavigationProp,
  NavigationState
} from '@react-navigation/native';

import { ModalsParamList } from '../enums/modals.enum';
import { ScreensParamList } from '../enums/screens.enum';
import { StacksParamList } from '../enums/stacks.enum';

export type NavigationParamList = StacksParamList & ScreensParamList & ModalsParamList;

export const useNavigation = () => useUntypedNavigation<NavigationProp<NavigationParamList>>();

export const useNavigationState = <T>(selector: (state: NavigationState<NavigationParamList>) => T) =>
  useUntypedNavigationState(selector);
