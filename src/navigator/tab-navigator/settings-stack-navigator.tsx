import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { CreateHdAccount } from '../../screens/create-hd-account/create-hd-account';
import { Settings } from '../../screens/settings/settings';
import { ScreensEnum, SettingsStackScreensParamList } from '../screens.enum';

const SettingsStack = createStackNavigator<SettingsStackScreensParamList>();

export const SettingsStackNavigator = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen name={ScreensEnum.Settings} component={Settings} />
    <SettingsStack.Screen name={ScreensEnum.CreateHdAccount} component={CreateHdAccount} />
  </SettingsStack.Navigator>
);
