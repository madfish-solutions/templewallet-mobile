import { PortalProvider } from '@gorhom/portal';
import { DefaultTheme, NavigationContainer, NavigationContainerRef, Theme } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions, TransitionPresets } from '@react-navigation/stack';
import React, { createRef, useMemo, useState } from 'react';

import { useModalOptions } from '../components/header/use-modal-options.util';
import { useQuickActions } from '../hooks/use-quick-actions.hook';
import { AddTokenModal } from '../modals/add-token-modal/add-token-modal';
import { CollectibleModal } from '../modals/collectible-modal/collectible-modal';
import { ConfirmationModal } from '../modals/confirmation-modal/confirmation-modal';
import { EnableBiometryPasswordModal } from '../modals/enable-biometry-password-modal/enable-biometry-password-modal';
import { ImportAccountModal } from '../modals/import-account-modal/import-account-modal';
import { ReceiveModal } from '../modals/receive-modal/receive-modal';
import { RenameAccountModal } from '../modals/rename-account-modal/rename-account-modal';
import { RevealPrivateKeyModal } from '../modals/reveal-private-key-modal/reveal-private-key-modal';
import { RevealSeedPhraseModal } from '../modals/reveal-seed-phrase-modal/reveal-seed-phrase-modal';
import { SelectBakerModal } from '../modals/select-baker-modal/select-baker-modal';
import { SendModal } from '../modals/send-modal/send-modal';
import { EnterPassword } from '../screens/enter-password/enter-password';
import { useAppLock } from '../shelter/use-app-lock.hook';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';
import { useColors } from '../styles/use-colors';
import { CurrentRouteNameContext } from './current-route-name.context';
import { ModalsEnum, ModalsParamList } from './enums/modals.enum';
import { ScreensEnum } from './enums/screens.enum';
import { StacksEnum } from './enums/stacks.enum';
import { MainStackScreen } from './main-stack';

export const globalNavigationRef = createRef<NavigationContainerRef<RootStackParamList>>();

type RootStackParamList = { MainStack: undefined } & ModalsParamList;

const RootStack = createStackNavigator<RootStackParamList>();

export const RootStackScreen = () => {
  const { isLocked } = useAppLock();
  const isAuthorised = useIsAuthorisedSelector();
  const colors = useColors();

  const [currentRouteName, setCurrentRouteName] = useState<ScreensEnum>(ScreensEnum.Welcome);

  useQuickActions();

  const handleNavigationContainerStateChange = () =>
    setCurrentRouteName(globalNavigationRef.current?.getCurrentRoute()?.name as ScreensEnum);

  const screenOptions: StackNavigationOptions = useMemo(
    () => ({
      presentation: 'modal',
      cardOverlayEnabled: true,
      gestureEnabled: true,
      ...TransitionPresets.ModalPresentationIOS,
      cardStyle: {
        backgroundColor: colors.pageBG
      }
    }),
    [colors.pageBG]
  );

  const theme: Theme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: colors.navigation
      }
    }),
    [colors.navigation]
  );

  return (
    <NavigationContainer
      ref={globalNavigationRef}
      theme={theme}
      onReady={handleNavigationContainerStateChange}
      onStateChange={handleNavigationContainerStateChange}
    >
      <PortalProvider>
        <CurrentRouteNameContext.Provider value={currentRouteName}>
          <RootStack.Navigator screenOptions={screenOptions}>
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
              name={ModalsEnum.RenameAccount}
              component={RenameAccountModal}
              options={useModalOptions('Rename account')}
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
            <RootStack.Screen
              name={ModalsEnum.EnableBiometryPassword}
              component={EnableBiometryPasswordModal}
              options={useModalOptions('Approve Password')}
            />
            <RootStack.Screen
              name={ModalsEnum.ImportAccount}
              component={ImportAccountModal}
              options={useModalOptions('Import account')}
            />
            <RootStack.Screen
              name={ModalsEnum.CollectibleModal}
              component={CollectibleModal}
              options={useModalOptions('NFT Name')}
            />
          </RootStack.Navigator>
        </CurrentRouteNameContext.Provider>
      </PortalProvider>

      {isAuthorised && isLocked && <EnterPassword />}
    </NavigationContainer>
  );
};
