import { PortalProvider } from '@gorhom/portal';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { createRef, useState } from 'react';

import { useModalOptions } from '../components/header/use-modal-options.util';
import { Loader } from '../components/loader/loader';
import { isIOS } from '../config/system';
import { useStorageMigration } from '../hooks/migration/useStorageMigration.hook';
import { useAppSplash } from '../hooks/use-app-splash.hook';
import { useDevicePasscode } from '../hooks/use-device-passcode.hook';
import { useQuickActions } from '../hooks/use-quick-actions.hook';
import { useResetKeychainOnInstall } from '../hooks/use-reset-keychain-on-install.hook';
import { useResetLoading } from '../hooks/use-reset-loading.hook';
import { useWhitelist } from '../hooks/use-whitelist.hook';
import { AddAssetModal } from '../modals/add-asset-modal/add-asset-modal';
import { AddCustomRpcModal } from '../modals/add-custom-rpc-modal/add-custom-rpc-modal';
import { AddLiquidityModal } from '../modals/add-liquidity-modal/add-liquidity-modal';
import { CollectibleModal } from '../modals/collectible-modal/collectible-modal';
import { ConfirmationModal } from '../modals/confirmation-modal/confirmation-modal';
import { EnableBiometryPasswordModal } from '../modals/enable-biometry-password-modal/enable-biometry-password-modal';
import { ImportAccountModal } from '../modals/import-account-modal/import-account-modal';
import { ReceiveModal } from '../modals/receive-modal/receive-modal';
import { RemoveLiquidityModal } from '../modals/remove-liquidity-modal/remove-liquidity-modal';
import { RenameAccountModal } from '../modals/rename-account-modal/rename-account-modal';
import { RevealPrivateKeyModal } from '../modals/reveal-private-key-modal/reveal-private-key-modal';
import { RevealSeedPhraseModal } from '../modals/reveal-seed-phrase-modal/reveal-seed-phrase-modal';
import { SelectBakerModal } from '../modals/select-baker-modal/select-baker-modal';
import { SendModal } from '../modals/send-modal/send-modal';
import { SplashModal } from '../modals/splash-modal/splash-modal';
import { AppCheckWarning } from '../screens/app-check/app-check-warning';
import { EnterPassword } from '../screens/enter-password/enter-password';
import { ForceUpdate } from '../screens/force-update/force-update';
import { PassCode } from '../screens/passcode/passcode';
import { useAppLock } from '../shelter/app-lock/app-lock';
import { useIsAppCheckFailed, useIsForceUpdateNeeded } from '../store/security/security-selectors';
import { useIsShowLoaderSelector } from '../store/settings/settings-selectors';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';
import { CurrentRouteNameContext } from './current-route-name.context';
import { ModalsEnum, ModalsParamList } from './enums/modals.enum';
import { ScreensEnum } from './enums/screens.enum';
import { StacksEnum } from './enums/stacks.enum';
import { useNavigationContainerTheme } from './hooks/use-navigation-container-theme.hook';
import { useStackNavigationOptions } from './hooks/use-stack-navigation-options.hook';
import { MainStackScreen } from './main-stack';

export const globalNavigationRef = createRef<NavigationContainerRef<RootStackParamList>>();

type RootStackParamList = { MainStack: undefined } & ModalsParamList;

const RootStack = createStackNavigator<RootStackParamList>();

export const RootStackScreen = () => {
  const { isLocked } = useAppLock();
  const isShowLoader = useIsShowLoaderSelector();
  const isAuthorised = useIsAuthorisedSelector();

  useStorageMigration();

  useWhitelist();
  useQuickActions();
  useResetLoading();
  useResetKeychainOnInstall();

  const isSplash = useAppSplash();
  const isPasscode = useDevicePasscode();
  const isForceUpdateNeeded = useIsForceUpdateNeeded();
  const isAppCheckFailed = useIsAppCheckFailed();

  const theme = useNavigationContainerTheme();
  const screenOptions = useStackNavigationOptions();

  const [currentRouteName, setCurrentRouteName] = useState<ScreensEnum>(ScreensEnum.Welcome);

  const handleNavigationContainerStateChange = () =>
    setCurrentRouteName(globalNavigationRef.current?.getCurrentRoute()?.name as ScreensEnum);

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
              name={ModalsEnum.AddAsset}
              component={AddAssetModal}
              options={useModalOptions('Add Asset')}
            />
            <RootStack.Screen
              name={ModalsEnum.RenameAccount}
              component={RenameAccountModal}
              options={useModalOptions('Rename account')}
            />
            <RootStack.Screen
              name={ModalsEnum.SelectBaker}
              component={SelectBakerModal}
              options={{ ...useModalOptions('Select Baker'), gestureEnabled: isIOS }}
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
            <RootStack.Screen
              name={ModalsEnum.RemoveLiquidity}
              component={RemoveLiquidityModal}
              options={useModalOptions('Remove Liquidity')}
            />
            <RootStack.Screen
              name={ModalsEnum.AddLiquidity}
              component={AddLiquidityModal}
              options={useModalOptions('Add Liquidity')}
            />

            <RootStack.Screen
              name={ModalsEnum.AddCustomRpc}
              component={AddCustomRpcModal}
              options={useModalOptions('Add RPC')}
            />
          </RootStack.Navigator>
        </CurrentRouteNameContext.Provider>
      </PortalProvider>

      {isSplash && <SplashModal />}
      {isAuthorised && isLocked && <EnterPassword />}
      {!isPasscode && <PassCode />}
      {isForceUpdateNeeded && <ForceUpdate />}
      {isAppCheckFailed && <AppCheckWarning />}
      {isShowLoader && <Loader />}
    </NavigationContainer>
  );
};
