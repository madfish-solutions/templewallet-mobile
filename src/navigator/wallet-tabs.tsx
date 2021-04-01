import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Wallet } from '../screens/wallet/wallet';
import { Settings } from '../screens/settings/settings';
import { ScreensEnum } from './screens.enum';

const Tab = createBottomTabNavigator();

export const WalletTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name={ScreensEnum.Wallet} component={Wallet} />
      <Tab.Screen name={ScreensEnum.Settings} component={Settings} />
    </Tab.Navigator>
  );
};
