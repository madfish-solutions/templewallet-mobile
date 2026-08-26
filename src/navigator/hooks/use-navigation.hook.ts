import {
  useNavigation as useUntypedNavigation,
  useNavigationState as useUntypedNavigationState,
  NavigationProp,
  NavigationState,
  useRoute,
  RouteProp,
  StackActions
} from '@react-navigation/native';
import { useCallback } from 'react';

import { ModalsEnum, ModalsParamList } from '../enums/modals.enum';
import { ScreensEnum, ScreensParamList } from '../enums/screens.enum';
import {
  MainStackNavigationParams,
  MainStackParams,
  NestedNavigationStacksParamList,
  StacksEnum,
  StacksParamList
} from '../enums/stacks.enum';

type NavigationParamList = StacksParamList & ScreensParamList & ModalsParamList;

type NestedNavigationParamList = NestedNavigationStacksParamList & ModalsParamList;

export const useNavigation = () => {
  const { navigate } = useUntypedNavigation<NavigationProp<NestedNavigationParamList>>();
  const { navigate: _, ...rest } = useUntypedNavigation<NavigationProp<NavigationParamList>>();

  return {
    navigate,
    ...rest
  };
};

export const isInModalsStack = (state: NavigationState | undefined): boolean => {
  if (!state) {
    return false;
  }

  const currentRoute = state.routes[state.index];

  return currentRoute?.name in ModalsEnum;
};

interface NavigateToScreenOptions {
  pop?: boolean;
}

export const useNavigateToScreen = ({ pop = false }: NavigateToScreenOptions = {}) => {
  const { navigate, dispatch, getState } = useNavigation();

  return useCallback(
    (screenParams: MainStackParams) => {
      const state = getState();

      // If currently in ModalsStack, first pop to dismiss the modal, then navigate
      if (isInModalsStack(state)) {
        dispatch(StackActions.popToTop());
      }

      const navigationParams: MainStackNavigationParams = pop ? { ...screenParams, pop } : screenParams;

      navigate(StacksEnum.MainStack, navigationParams);
    },
    [navigate, dispatch, getState, pop]
  );
};

export const useNavigateToModal = () => {
  const { navigate } = useNavigation();

  return navigate;
};

export const useScreenParams = <T extends ScreensEnum>() => {
  const { params } = useRoute<RouteProp<ScreensParamList, T>>();

  return params as ScreensParamList[T];
};

export const useModalParams = <T extends ModalsEnum>() => {
  const { params } = useRoute<RouteProp<ModalsParamList, T>>();

  return params as ModalsParamList[T];
};

export const useNavigationState = <T>(selector: (state: NavigationState<NavigationParamList>) => T) =>
  useUntypedNavigationState(selector);
