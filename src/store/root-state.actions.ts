import { ParamListBase } from '@react-navigation/native';
import { createAction } from '@reduxjs/toolkit';

import { NavigationArgsType } from '../interfaces/navigation-args.type';
import { NavigationParamList } from '../navigator/hooks/use-navigation.hook';
import { createActions } from './create-actions';

export const resetApplicationAction = createActions('root/RESET_APPLICATION');
export const resetKeychainOnInstallAction = createActions('root/RESET_KEYCHAIN_ON_INSTALL');

export const untypedNavigateAction =
  createAction<NavigationArgsType<ParamListBase, keyof ParamListBase>>('navigation/NAVIGATE');
export const navigateAction = <RouteName extends keyof NavigationParamList>(
  ...navigationArgs: NavigationArgsType<NavigationParamList, RouteName>
) => createAction<NavigationArgsType<NavigationParamList, RouteName>>('navigation/NAVIGATE')(navigationArgs);
