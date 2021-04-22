import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { ScreensEnum, TabScreensParamList } from '../screens.enum';
import { SettingsStackNavigator } from './settings-stack-navigator';
import { WalletStackNavigator } from './wallet-stack-navigator';

const Tab = createBottomTabNavigator<TabScreensParamList>();

export const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name={ScreensEnum.Wallet} component={WalletStackNavigator} />
    <Tab.Screen name={ScreensEnum.Settings} component={SettingsStackNavigator} />
  </Tab.Navigator>
);
