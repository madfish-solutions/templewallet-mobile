import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { Settings } from '../screens/settings/settings';
import { Wallet } from '../screens/wallet/wallet';
import { ScreensEnum, ScreensParamList } from './screens.enum';
import { Home } from '../screens/home/home';

const Tab = createBottomTabNavigator<ScreensParamList>();

export const WalletTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name={ScreensEnum.Home} component={Home} />
      <Tab.Screen name={ScreensEnum.Wallet} component={Wallet} />
      <Tab.Screen name={ScreensEnum.Settings} component={Settings} />
    </Tab.Navigator>
  );
};
