import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { TezosTokenScreen } from '../../screens/tezos-token-screen/tezos-token-screen';
import { TokenScreen } from '../../screens/token-screen/token-screen';
import { Wallet } from '../../screens/wallet/wallet';
import { ScreensEnum, WalletStackScreensParamList } from '../screens.enum';
import { useStackNavigatorStyleOptions } from '../use-stack-navigator-style-options.hook';

const WalletStack = createStackNavigator<WalletStackScreensParamList>();

export const WalletStackNavigator = () => {
  const styleScreenOptions = useStackNavigatorStyleOptions();

  return (
    <WalletStack.Navigator screenOptions={styleScreenOptions}>
      <WalletStack.Screen name={ScreensEnum.Wallet} component={Wallet} options={{ headerShown: false }} />
      <WalletStack.Screen name={ScreensEnum.TezosTokenScreen} component={TezosTokenScreen} />
      <WalletStack.Screen name={ScreensEnum.TokenScreen} component={TokenScreen} />
    </WalletStack.Navigator>
  );
};
