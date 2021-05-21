import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { CreateHdAccount } from '../../screens/create-hd-account/create-hd-account';
import { ManageAccounts } from '../../screens/manage-accounts/manage-accounts';
import { Settings } from '../../screens/settings/settings';
import { ScreensEnum, SettingsStackScreensParamList } from '../screens.enum';
import { useStackNavigatorStyleOptions } from '../use-stack-navigator-style-options.hook';

const SettingsStack = createStackNavigator<SettingsStackScreensParamList>();

export const SettingsStackNavigator = () => {
  const styleScreenOptions = useStackNavigatorStyleOptions();

  return (
    <SettingsStack.Navigator screenOptions={styleScreenOptions}>
      <SettingsStack.Screen name={ScreensEnum.Settings} component={Settings} />
      <SettingsStack.Screen name={ScreensEnum.CreateHdAccount} component={CreateHdAccount} />
      <SettingsStack.Screen name={ScreensEnum.ManageAccounts} component={ManageAccounts} />
    </SettingsStack.Navigator>
  );
};
