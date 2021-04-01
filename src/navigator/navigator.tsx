import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ImportAccount } from '../screens/import-account/import-account';
import { CreateAccount } from '../screens/create-account/create-account';
import { WalletTabs } from './wallet-tabs/wallet-tabs';
import { ScreensEnum } from './screens.enum';
import { isAuthorized, isLocked } from '../app/app';
import { EnterPassword } from '../screens/enter-password/enter-password';
import { ConfirmationWindow } from '../screens/confirmation-window/confirmation-window';

const Stack = createStackNavigator();

export const Navigator = () => {
  return (
    <Stack.Navigator>
      {!isAuthorized ? (
        <>
          <Stack.Screen
            name={ScreensEnum.ImportAccount}
            component={ImportAccount}
          />
          <Stack.Screen
            name={ScreensEnum.CreateAccount}
            component={CreateAccount}
          />
        </>
      ) : (
        <Stack.Screen name="Wallet" component={WalletTabs} />
      )}
    </Stack.Navigator>
  );
};
// <>
// <Stack.Screen
//     name={ScreensEnum.EnterPassword}
//     component={EnterPassword}
//   />
//   <Stack.Screen
//     name={ScreensEnum.ConfirmationWindow}
//     component={ConfirmationWindow}
//   />
// </>
