import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import React from 'react';

import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { formatSize } from '../../../styles/format-size';
import { useTabBarColor } from './use-tab-bar-color.hook';

const createTabBarIconComponent = (
  iconName: IconNameEnum,
  disabled = false
): BottomTabNavigationOptions['tabBarIcon'] => ({ focused }) => {
  const color = useTabBarColor(focused, disabled);

  return <Icon name={iconName} color={color} size={formatSize(28)} />;
};

export const WalletTabBarIcon = createTabBarIconComponent(IconNameEnum.XtzWallet);
export const DAppsTabBarIcon = createTabBarIconComponent(IconNameEnum.SoonBadge, true);
export const SwapTabBarIcon = createTabBarIconComponent(IconNameEnum.SoonBadge, true);
export const SettingsTabBarIcon = createTabBarIconComponent(IconNameEnum.Settings);
