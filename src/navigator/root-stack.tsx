import { PortalProvider } from '@gorhom/portal';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { createRef, useState } from 'react';

import { useModalOptions } from 'src/components/header/use-modal-options.util';
import { Loader } from 'src/components/loader/loader';
import { isIOS } from 'src/config/system';
import { useStorageMigration } from 'src/hooks/migration/useStorageMigration.hook';
import { useAppSplash } from 'src/hooks/use-app-splash.hook';
import { useDevicePasscode } from 'src/hooks/use-device-passcode.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useQuickActions } from 'src/hooks/use-quick-actions.hook';
import { useResetKeychainOnInstall } from 'src/hooks/use-reset-keychain-on-install.hook';
import { useResetLoading } from 'src/hooks/use-reset-loading.hook';
import { useTokensMetadataFixtures } from 'src/hooks/use-tokens-metadata-fixtures';
import { useWhitelist } from 'src/hooks/use-whitelist.hook';
import { AddAssetModal } from 'src/modals/add-asset-modal/add-asset-modal';
import { AddLiquidityModal } from 'src/modals/add-liquidity-modal/add-liquidity-modal';
import { CollectibleModal } from 'src/modals/collectible-modal/collectible-modal';
import { ConfirmationModal } from 'src/modals/confirmation-modal/confirmation-modal';
import { AddContactModal } from 'src/modals/contact-modals/add-contact-modal/add-contact-modal';
import { EditContactModal } from 'src/modals/contact-modals/edit-contact-modal/edit-contact-modal';
import { AddCustomRpcModal } from 'src/modals/custom-rpc-modals/add-modal/add-modal';
import { EditCustomRpcModal } from 'src/modals/custom-rpc-modals/edit-modal/edit-modal';
import { EnableBiometryPasswordModal } from 'src/modals/enable-biometry-password-modal/enable-biometry-password-modal';
import { ImportAccountModal } from 'src/modals/import-account-modal/import-account-modal';
import { ReceiveModal } from 'src/modals/receive-modal/receive-modal';
import { RemoveLiquidityModal } from 'src/modals/remove-liquidity-modal/remove-liquidity-modal';
import { RenameAccountModal } from 'src/modals/rename-account-modal/rename-account-modal';
import { RevealPrivateKeyModal } from 'src/modals/reveal-private-key-modal/reveal-private-key-modal';
import { RevealSeedPhraseModal } from 'src/modals/reveal-seed-phrase-modal/reveal-seed-phrase-modal';
import { SelectBakerModal } from 'src/modals/select-baker-modal/select-baker-modal';
import { SendModal } from 'src/modals/send-modal/send-modal';
import { SplashModal } from 'src/modals/splash-modal/splash-modal';
import { AppCheckWarning } from 'src/screens/app-check/app-check-warning';
import { EnterPassword } from 'src/screens/enter-password/enter-password';
import { ForceUpdate } from 'src/screens/force-update/force-update';
import { PassCode } from 'src/screens/passcode/passcode';
import { useAppLock } from 'src/shelter/app-lock/app-lock';
import { useIsAppCheckFailed, useIsForceUpdateNeeded } from 'src/store/security/security-selectors';
import { useIsShowLoaderSelector } from 'src/store/settings/settings-selectors';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';

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
  const { isDcpNode } = useNetworkInfo();

  useStorageMigration();

  useTokensMetadataFixtures();
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

            {/* MODALS */}
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
              options={{ ...useModalOptions(`Select ${isDcpNode ? 'Producer' : 'Baker'}`), gestureEnabled: isIOS }}
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
            <RootStack.Screen
              name={ModalsEnum.EditCustomRpc}
              component={EditCustomRpcModal}
              options={useModalOptions('Edit RPC')}
            />
            <RootStack.Screen
              name={ModalsEnum.AddContact}
              component={AddContactModal}
              options={useModalOptions('Add contact')}
            />
            <RootStack.Screen
              name={ModalsEnum.EditContact}
              component={EditContactModal}
              options={useModalOptions('Edit contact')}
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
