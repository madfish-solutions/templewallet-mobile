import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ConfirmationWindow } from '../screens/confirmation-window/confirmation-window';
import { CreateAccount } from '../screens/create-account/create-account';
import { EnterPassword } from '../screens/enter-password/enter-password';
import { ImportAccount } from '../screens/import-account/import-account';
import { Welcome } from '../screens/welcome/welcome';
import { useAppLock } from '../shelter/use-app-lock.hook';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';
import { ScreensEnum, ScreensParamList } from './screens.enum';
import { TabNavigator } from './tab-navigator/tab-navigator';
import { useStackNavigatorStyleOptions } from './use-stack-navigator-style-options.hook';

const Stack = createStackNavigator<ScreensParamList>();

const isConfirmation = false;

export const Navigator = () => {
  const isAuthorised = useIsAuthorisedSelector();
  const { isLocked } = useAppLock();
  const styleScreenOptions = useStackNavigatorStyleOptions();

  return (
    <>
      <Stack.Navigator screenOptions={{ ...styleScreenOptions, headerShown: !isAuthorised }}>
        {!isAuthorised ? (
          <>
            <Stack.Screen name={ScreensEnum.Welcome} component={Welcome} options={{ headerShown: false }} />
            <Stack.Screen name={ScreensEnum.ImportAccount} component={ImportAccount} />
            <Stack.Screen name={ScreensEnum.CreateAccount} component={CreateAccount} />
          </>
        ) : (
          <Stack.Screen name={ScreensEnum.Wallet} component={TabNavigator} />
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
