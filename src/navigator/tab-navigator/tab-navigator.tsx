import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { emptyComponent } from '../../config/general';
import { ScreensEnum, TabScreensParamList } from '../screens.enum';
import { SettingsStackNavigator } from './settings-stack-navigator';
import { DisabledTabBarButton } from './tab-bar-options/disabled-tab-bar-button';
import { DAppsTabBarIcon, SettingsTabBarIcon, SwapTabBarIcon, WalletTabBarIcon } from './tab-bar-options/tab-bar-icon';
import {
  DAppsTabBarLabel,
  SettingsTabBarLabel,
  SwapTabBarLabel,
  WalletTabBarLabel
} from './tab-bar-options/tab-bar-label';
import { useTabNavigatorStyles } from './tab-navigator.styles';
import { WalletStackNavigator } from './wallet-stack-navigator';

const Tab = createBottomTabNavigator<TabScreensParamList>();

export const TabNavigator = () => {
  const styles = useTabNavigatorStyles();

  return (
    <Tab.Navigator tabBarOptions={{ style: styles.tabBar }}>
      <Tab.Screen
        name={ScreensEnum.Wallet}
        options={{
          tabBarLabel: WalletTabBarLabel,
          tabBarIcon: WalletTabBarIcon
        }}
        component={WalletStackNavigator}
      />
      <Tab.Screen
        name={ScreensEnum.DApps}
        options={{
          tabBarLabel: DAppsTabBarLabel,
          tabBarIcon: DAppsTabBarIcon,
          tabBarButton: DisabledTabBarButton
        }}
        component={emptyComponent}
      />
      <Tab.Screen
        name={ScreensEnum.Swap}
        options={{
          tabBarLabel: SwapTabBarLabel,
          tabBarIcon: SwapTabBarIcon,
          tabBarButton: DisabledTabBarButton
        }}
        component={emptyComponent}
      />
      <Tab.Screen
        name={ScreensEnum.Settings}
        options={{
          tabBarLabel: SettingsTabBarLabel,
          tabBarIcon: SettingsTabBarIcon
        }}
        component={SettingsStackNavigator}
      />
    </Tab.Navigator>
  );
};
