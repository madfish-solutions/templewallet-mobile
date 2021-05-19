import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { Wallet } from '../../screens/wallet/wallet';
import { ScreensEnum, WalletStackScreensParamList } from '../screens.enum';
import { useStackNavigatorStyleOptions } from '../use-stack-navigator-style-options.hook';

const WalletStack = createStackNavigator<WalletStackScreensParamList>();

export const WalletStackNavigator = () => {
  const styleScreenOptions = useStackNavigatorStyleOptions();

  return (
    <WalletStack.Navigator screenOptions={styleScreenOptions}>
      <WalletStack.Screen name={ScreensEnum.Wallet} component={Wallet} options={{ headerShown: false }} />
    </WalletStack.Navigator>
  );
};
