import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ImportAccount } from '../screens/import-account/import-account';
import { CreateAccount } from '../screens/create-account/create-account';
import { ScreensEnum, ScreensParamList } from './screens.enum';
import { EnterPassword } from '../screens/enter-password/enter-password';
import { ConfirmationWindow } from '../screens/confirmation-window/confirmation-window';
import { WalletTabs } from './wallet-tabs';
import { Welcome } from '../screens/welcome/welcome';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';
import { useShelter } from '../shelter/shelter';

const Stack = createStackNavigator<ScreensParamList>();

const isConfirmation = false;

export const Navigator = () => {
  const isAuthorised = useIsAuthorisedSelector();
  const { isLocked } = useShelter();

  return (
    <>
      <Stack.Navigator headerMode="none">
        {!isAuthorised ? (
          <>
            <Stack.Screen name={ScreensEnum.Welcome} component={Welcome} />
            <Stack.Screen name={ScreensEnum.ImportAccount} component={ImportAccount} />
            <Stack.Screen name={ScreensEnum.CreateAccount} component={CreateAccount} />
          </>
        ) : (
          <Stack.Screen name={ScreensEnum.Wallet} component={WalletTabs} />
        )}
      </Stack.Navigator>

      {isAuthorised && (
        <>
          {isLocked && <EnterPassword />}
          {isConfirmation && <ConfirmationWindow />}
        </>
      )}
    </>
  );
};
