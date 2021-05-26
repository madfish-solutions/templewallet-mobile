import { NavigationContainerRef } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { Text } from 'react-native';

import { ConfirmationWindow } from '../screens/confirmation-window/confirmation-window';
import { CreateAccount } from '../screens/create-account/create-account';
import { EnterPassword } from '../screens/enter-password/enter-password';
import { ImportAccount } from '../screens/import-account/import-account';
import { Welcome } from '../screens/welcome/welcome';
import { useAppLock } from '../shelter/use-app-lock.hook';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';
import { ScreensEnum, ScreensParamList } from './screens.enum';
import { TabBar } from './tab-bar/tab-bar';
import { TabNavigator } from './tab-navigator/tab-navigator';
import { useStackNavigatorStyleOptions } from './use-stack-navigator-style-options.hook';

const RootStack = createStackNavigator();
export const RootStackScreen = () => {
  const navigationRef = useRef<NavigationContainerRef>(null);
  const [currentRouteName, setCurrentRouteName] = useState<ScreensEnum>();

  const handleNavigationContainerStateChange = () =>
    setCurrentRouteName(navigationRef.current?.getCurrentRoute()?.name as ScreensEnum);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleNavigationContainerStateChange}
      onStateChange={handleNavigationContainerStateChange}>
      <RootStack.Navigator mode="modal">
        <RootStack.Screen
          name="Main"
          component={Navigator}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="MyModal" component={() => <Text>hii</Text>} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const Stack = createStackNavigator<ScreensParamList>();

const isConfirmation = false;

export const Navigator = () => {
  const { isLocked } = useAppLock();
  const isAuthorised = useIsAuthorisedSelector();
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

      <TabBar currentRouteName={''} />

      {isAuthorised && (
        <>
          {isLocked && <EnterPassword />}
          {isConfirmation && <ConfirmationWindow />}
        </>
      )}
    </>
  );
};
