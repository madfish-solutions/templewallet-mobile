import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { emptyComponent } from '../../config/general';
import { ScreensEnum, TabScreensParamList } from '../screens.enum';
import { SettingsStackNavigator } from './settings-stack-navigator';
import { WalletStackNavigator } from './wallet-stack-navigator';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { greyLight, orange, step } from '../../config/styles';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator<TabScreensParamList>();

export const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name={ScreensEnum.Wallet}
      options={{
        tabBarLabel: ({ focused, color, size }) => {
          return <Text>Wallet</Text>;
        },
        tabBarIcon: ({ focused, color, size }) => {
          return <Icon name={IconNameEnum.XtzWallet} color={focused ? orange : greyLight} size={3.5 * step} />;
        }
      }}
      component={WalletStackNavigator}
    />
    <Tab.Screen name={ScreensEnum.DApps} component={emptyComponent} />
    <Tab.Screen name={ScreensEnum.Swap} component={emptyComponent} />
    <Tab.Screen name={ScreensEnum.Settings} component={SettingsStackNavigator} />
  </Tab.Navigator>
);
