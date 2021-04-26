import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { Wallet } from '../../screens/wallet/wallet';
import { ScreensEnum, WalletStackScreensParamList } from '../screens.enum';

const WalletStack = createStackNavigator<WalletStackScreensParamList>();

export const WalletStackNavigator = () => (
  <WalletStack.Navigator>
    <WalletStack.Screen name={ScreensEnum.Wallet} component={Wallet} />
  </WalletStack.Navigator>
);
