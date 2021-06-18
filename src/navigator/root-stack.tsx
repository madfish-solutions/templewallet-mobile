import { PortalProvider } from '@gorhom/portal';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { createRef, useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';

import { useModalOptions } from '../components/header/use-modal-options.util';
import { AddTokenModal } from '../modals/add-token-modal/add-token-modal';
import { ConfirmationModal } from '../modals/confirmation-modal/confirmation-modal';
import { CreateHdAccountModal } from '../modals/create-hd-account-modal/create-hd-account-modal';
import { ReceiveModal } from '../modals/receive-modal/receive-modal';
import { RevealPrivateKeyModal } from '../modals/reveal-private-key-modal/reveal-private-key-modal';
import { RevealSeedPhraseModal } from '../modals/reveal-seed-phrase-modal/reveal-seed-phrase-modal';
import { SelectBakerModal } from '../modals/select-baker-modal/select-baker-modal';
import { SendModal } from '../modals/send-modal/send-modal';
import { CurrentRouteNameContext } from './current-route-name.context';
import { ModalsEnum, ModalsParamList } from './enums/modals.enum';
import { ScreensEnum } from './enums/screens.enum';
import { StacksEnum } from './enums/stacks.enum';
import { useStatusBarStyle } from './hooks/use-status-bar-style.hook';
import { MainStackScreen } from './main-stack';

export const globalNavigationRef = createRef<NavigationContainerRef>();

type RootStackParamList = { MainStack: undefined } & ModalsParamList;

const RootStack = createStackNavigator<RootStackParamList>();

export const RootStackScreen = () => {
  const [currentRouteName, setCurrentRouteName] = useState<ScreensEnum>(ScreensEnum.Welcome);

  useStatusBarStyle();

  const handleNavigationContainerStateChange = () =>
    setCurrentRouteName(globalNavigationRef.current?.getCurrentRoute()?.name as ScreensEnum);

  useEffect(() => {
    const listener = ({ url }: { url: string }) => Alert.alert('Got URL', url, [{ text: 'OK' }]);

    Linking.addEventListener('url', listener);

    return () => Linking.removeEventListener('url', listener);
  }, []);

  return (
    <NavigationContainer
      ref={globalNavigationRef}
      onReady={handleNavigationContainerStateChange}
      onStateChange={handleNavigationContainerStateChange}>
      <PortalProvider>
        <CurrentRouteNameContext.Provider value={currentRouteName}>
          <RootStack.Navigator
            mode="modal"
            screenOptions={{
              cardOverlayEnabled: true,
              gestureEnabled: true,
              ...TransitionPresets.ModalPresentationIOS
            }}>
            <RootStack.Screen
              name={StacksEnum.MainStack}
              component={MainStackScreen}
              options={{ headerShown: false }}
            />

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
            <RootStack.Screen
              name={ModalsEnum.RevealSeedPhrase}
              component={RevealSeedPhraseModal}
              options={useModalOptions('Reveal Seed')}
            />
            <RootStack.Screen
              name={ModalsEnum.RevealPrivateKey}
              component={RevealPrivateKeyModal}
              options={useModalOptions('Reveal Private key')}
            />
            <RootStack.Screen
              name={ModalsEnum.Confirmation}
              component={ConfirmationModal}
              options={useModalOptions('Confirm Operation')}
            />
          </RootStack.Navigator>
        </CurrentRouteNameContext.Provider>
      </PortalProvider>
    </NavigationContainer>
  );
};
