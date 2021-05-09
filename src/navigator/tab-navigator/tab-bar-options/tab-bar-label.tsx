import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';

import { useTabBarLabelStyles } from './tab-bar-label.styles';
import { useTabBarColor } from './use-tab-bar-color.hook';

const createTabBarLabelComponent = (label: string, disabled = false): BottomTabNavigationOptions['tabBarLabel'] => ({
  focused
}) => {
  const styles = useTabBarLabelStyles();
  const color = useTabBarColor(focused, disabled);

  return <Text style={[styles.label, { color }]}>{label}</Text>;
};

export const WalletTabBarLabel = createTabBarLabelComponent('Wallet');
export const DAppsTabBarLabel = createTabBarLabelComponent('DApps', true);
export const SwapTabBarLabel = createTabBarLabelComponent('Swap', true);
export const SettingsTabBarLabel = createTabBarLabelComponent('Settings');
