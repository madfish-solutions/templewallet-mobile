import { ParamListBase } from '@react-navigation/native';
import { createAction } from '@reduxjs/toolkit';

import { NavigationArgsType } from '../interfaces/navigation-args.type';
import { NavigationParamList } from '../navigator/hooks/use-navigation.hook';

export const rootStateResetAction = createAction('root/RESET');

export const keychainResetSuccessAction = createAction('keychain/RESET-SUCCESS');

export const untypedNavigateAction =
  createAction<NavigationArgsType<ParamListBase, keyof ParamListBase>>('navigation/NAVIGATE');
export const navigateAction = <RouteName extends keyof NavigationParamList>(
  ...navigationArgs: NavigationArgsType<NavigationParamList, RouteName>
) => createAction<NavigationArgsType<NavigationParamList, RouteName>>('navigation/NAVIGATE')(navigationArgs);
