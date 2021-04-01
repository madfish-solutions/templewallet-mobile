import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Wallet } from '../../screens/wallet/wallet';
import { Settings } from '../../screens/settings/settings';
import { ScreensEnum } from '../screens.enum';
import { isConfirmation, isLocked } from '../../app/app';
import { EnterPassword } from '../../screens/enter-password/enter-password';
import { ConfirmationWindow } from '../../screens/confirmation-window/confirmation-window';

const Tab = createBottomTabNavigator();

export const WalletTabs = () => {
  return (
    <>
      {isLocked && <EnterPassword />}
      {isConfirmation && <ConfirmationWindow />}
      <Tab.Navigator>
        <Tab.Screen name={ScreensEnum.Wallet} component={Wallet} />
        <Tab.Screen name={ScreensEnum.Settings} component={Settings} />
      </Tab.Navigator>
    </>
  );
};
