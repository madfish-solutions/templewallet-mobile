import { NavigationContainerRef } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';

import { useModalOptions } from '../components/header/use-modal-options.util';
import { AddTokenModal } from '../modals/add-token-modal/add-token-modal';
import { CreateHdAccountModal } from '../modals/create-hd-account-modal/create-hd-account-modal';
import { ReceiveModal } from '../modals/receive-modal/receive-modal';
import { SelectBakerModal } from '../modals/select-baker-modal/select-baker-modal';
import { SendModal } from '../modals/send-modal/send-modal';
import { CurrentRouteNameContext } from './current-route-name.context';
import { MainStackScreen } from './main-stack';
import { ModalsEnum, ModalsParamList } from './modals.enum';
import { ScreensEnum } from './screens.enum';
import { useStatusBarStyle } from './use-status-bar-style.hook';

type RootStackParamList = { MainStack: undefined } & ModalsParamList;

const RootStack = createStackNavigator<RootStackParamList>();

export const RootStackScreen = () => {
  const navigationRef = useRef<NavigationContainerRef>(null);
  const [currentRouteName, setCurrentRouteName] = useState<ScreensEnum>(ScreensEnum.Welcome);

  useStatusBarStyle();

  const handleNavigationContainerStateChange = () =>
    setCurrentRouteName(navigationRef.current?.getCurrentRoute()?.name as ScreensEnum);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleNavigationContainerStateChange}
      onStateChange={handleNavigationContainerStateChange}>
      <CurrentRouteNameContext.Provider value={currentRouteName}>
        <RootStack.Navigator
          mode="modal"
          screenOptions={{ cardOverlayEnabled: true, gestureEnabled: true, ...TransitionPresets.ModalPresentationIOS }}>
          <RootStack.Screen name="MainStack" component={MainStackScreen} options={{ headerShown: false }} />

          <RootStack.Screen name={ModalsEnum.Receive} component={ReceiveModal} options={useModalOptions('Receive')} />
          <RootStack.Screen name={ModalsEnum.Send} component={SendModal} options={useModalOptions('Send')} />
          <RootStack.Screen
            name={ModalsEnum.AddToken}
            component={AddTokenModal}
            options={useModalOptions('Add Token')}
          />
          <RootStack.Screen
            name={ModalsEnum.CreateHdAccount}
            component={CreateHdAccountModal}
            options={useModalOptions('Create account')}
          />
          <RootStack.Screen
            name={ModalsEnum.SelectBaker}
            component={SelectBakerModal}
            options={useModalOptions('Select Baker')}
          />
        </RootStack.Navigator>
      </CurrentRouteNameContext.Provider>
    </NavigationContainer>
  );
};
