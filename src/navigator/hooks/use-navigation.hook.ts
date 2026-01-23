import {
  useNavigation as useUntypedNavigation,
  useNavigationState as useUntypedNavigationState,
  NavigationProp,
  NavigationState,
  useRoute,
  RouteProp
} from '@react-navigation/native';
import { useCallback } from 'react';

import { ModalsParamList } from '../enums/modals.enum';
import { ScreensEnum, ScreensParamList } from '../enums/screens.enum';
import { MainStackParams, NestedNavigationStacksParamList, StacksEnum, StacksParamList } from '../enums/stacks.enum';

export type NavigationParamList = StacksParamList & ScreensParamList & ModalsParamList;

type NestedNavigationParamList = NestedNavigationStacksParamList & ModalsParamList;

export const useNavigation = () => {
  const { navigate } = useUntypedNavigation<NavigationProp<NestedNavigationParamList>>();
  const { navigate: _, ...rest } = useUntypedNavigation<NavigationProp<NavigationParamList>>();

  return {
    navigate,
    ...rest
  };
};

export const useNavigateToScreen = () => {
  const { navigate } = useNavigation();

  return useCallback((screenParams: MainStackParams) => navigate(StacksEnum.MainStack, screenParams), [navigate]);
};

export const useScreenParams = <T extends ScreensEnum>() => {
  const { params } = useRoute<RouteProp<ScreensParamList, T>>();

  return params as ScreensParamList[T];
};

export const useNavigationState = <T>(selector: (state: NavigationState<NavigationParamList>) => T) =>
  useUntypedNavigationState(selector);
