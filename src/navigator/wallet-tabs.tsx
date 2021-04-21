import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { Wallet } from '../screens/wallet/wallet';
import { Settings } from '../screens/settings/settings';
import { ScreensEnum, ScreensParamList } from './screens.enum';

const Tab = createBottomTabNavigator<ScreensParamList>();

export const WalletTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name={ScreensEnum.Wallet} component={Wallet} />
      <Tab.Screen name={ScreensEnum.Settings} component={Settings} />
    </Tab.Navigator>
  );
};
