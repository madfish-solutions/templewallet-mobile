import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ImportAccount } from '../screens/import-account/import-account';
import { CreateAccount } from '../screens/create-account/create-account';
import { isAuthorized, isConfirmation, isLocked } from '../app/app';
import { ScreensEnum, ScreensParamList } from './screens.enum';
import { EnterPassword } from '../screens/enter-password/enter-password';
import { ConfirmationWindow } from '../screens/confirmation-window/confirmation-window';
import { WalletTabs } from './wallet-tabs';
import { Welcome } from '../screens/welcome/welcome';

const Stack = createStackNavigator<ScreensParamList>();

export const Navigator = () => {
  return (
    <>
      <Stack.Navigator headerMode="none">
        {!isAuthorized ? (
          <>
            <Stack.Screen name={ScreensEnum.Welcome} component={Welcome} />
            <Stack.Screen name={ScreensEnum.ImportAccount} component={ImportAccount} />
            <Stack.Screen name={ScreensEnum.CreateAccount} component={CreateAccount} />
          </>
        ) : (
          <Stack.Screen name={ScreensEnum.Wallet} component={WalletTabs} />
        )}
      </Stack.Navigator>

      {isAuthorized && (
        <>
          {isLocked && <EnterPassword />}
          {isConfirmation && <ConfirmationWindow />}
        </>
      )}
    </>
  );
}
;
