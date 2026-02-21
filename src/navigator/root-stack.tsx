import { PortalProvider } from '@gorhom/portal';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useModalOptions } from 'src/components/header/use-modal-options.util';
import { Loader } from 'src/components/loader/loader';
import { isIOS } from 'src/config/system';
import { useRootHooks } from 'src/hooks/root-hooks';
import { useAppSplash } from 'src/hooks/use-app-splash.hook';
import { useDevicePasscode } from 'src/hooks/use-device-passcode.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { AddAssetModal } from 'src/modals/add-asset-modal/add-asset-modal';
import { ChooseAccountImportType } from 'src/modals/choose-account-import-type';
import { ChooseWalletImportType } from 'src/modals/choose-wallet-import-type';
import { CollectibleModal } from 'src/modals/collectible-modal/collectible-modal';
import { ConfirmationModal } from 'src/modals/confirmation-modal/confirmation-modal';
import { AddContactModal } from 'src/modals/contact-modals/add-contact-modal/add-contact-modal';
import { EditContactModal } from 'src/modals/contact-modals/edit-contact-modal/edit-contact-modal';
import { AddCustomRpcModal } from 'src/modals/custom-rpc-modals/add-modal/add-modal';
import { EditCustomRpcModal } from 'src/modals/custom-rpc-modals/edit-modal/edit-modal';
import { EnableBiometryPasswordModal } from 'src/modals/enable-biometry-password-modal/enable-biometry-password-modal';
import { InAppBrowser } from 'src/modals/in-app-browser';
import { KoloCardWidgetModal } from 'src/modals/kolo-card';
import { ManageEarnOpportunityModal } from 'src/modals/manage-earn-opportunity-modal';
import { Newsletter } from 'src/modals/newsletter/newsletter-modal';
import { ReceiveModal } from 'src/modals/receive-modal/receive-modal';
import { RenameAccountModal } from 'src/modals/rename-account-modal/rename-account-modal';
import { RevealPrivateKeyModal } from 'src/modals/reveal-private-key-modal/reveal-private-key-modal';
import { RevealSeedPhraseModal } from 'src/modals/reveal-seed-phrase-modal/reveal-seed-phrase-modal';
import { SelectBakerModal } from 'src/modals/select-baker-modal/select-baker-modal';
import { SendModal } from 'src/modals/send-modal/send-modal';
import { SplashModal } from 'src/modals/splash-modal/splash-modal';
import { AfterSyncQRScan } from 'src/modals/sync-account/after-sync-qr-scan/after-sync-qr-scan';
import { AppCheckWarning } from 'src/screens/app-check/app-check-warning';
import { EnterPassword } from 'src/screens/enter-password/enter-password';
import { ForceUpdate } from 'src/screens/force-update/force-update';
import { PassCode } from 'src/screens/passcode/passcode';
import { useAppLock } from 'src/shelter/app-lock/app-lock';
import { shouldShowNewsletterModalAction } from 'src/store/newsletter/newsletter-actions';
import { useIsAppCheckFailed, useIsForceUpdateNeeded } from 'src/store/security/security-selectors';
import { useIsShowLoaderSelector } from 'src/store/settings/settings-selectors';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';

import { CurrentRouteNameContext } from './current-route-name.context';
import { ModalsEnum, ModalsParamList } from './enums/modals.enum';
import { ScreensEnum } from './enums/screens.enum';
import { NestedNavigationStacksParamList, StacksEnum } from './enums/stacks.enum';
import { globalNavigationRef } from './global-nav-ref';
import { useNavigationContainerTheme } from './hooks/use-navigation-container-theme.hook';
import { useStackNavigationOptions } from './hooks/use-stack-navigation-options.hook';
import { MainStackScreen } from './main-stack';

export type RootStackParamList = NestedNavigationStacksParamList & ModalsParamList;

const RootStack = createStackNavigator<RootStackParamList>();

export const RootStackScreen = () => {
  const dispatch = useDispatch();
  const { isLocked } = useAppLock();
  const isShowLoader = useIsShowLoaderSelector();
  const isAuthorised = useIsAuthorisedSelector();
  const { isDcpNode } = useNetworkInfo();

  useRootHooks();

  const isSplash = useAppSplash();
  const isPasscode = useDevicePasscode();
  const isForceUpdateNeeded = useIsForceUpdateNeeded();
  const isAppCheckFailed = useIsAppCheckFailed();

  const theme = useNavigationContainerTheme();
  const screenOptions = useStackNavigationOptions();

  const [currentRouteName, setCurrentRouteName] = useState<ScreensEnum | ModalsEnum>(ScreensEnum.Welcome);

  const handleNavigationContainerStateChange = () =>
    setCurrentRouteName(globalNavigationRef.current?.getCurrentRoute()?.name as ScreensEnum | ModalsEnum);

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
              options={useModalOptions(`Select ${isDcpNode ? 'Producer' : 'Baker'}`, true)}
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
              name={ModalsEnum.CollectibleModal}
              component={CollectibleModal}
              options={{ ...useModalOptions(), gestureEnabled: isIOS }}
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
            <RootStack.Screen
              name={ModalsEnum.ManageFarmingPool}
              component={ManageEarnOpportunityModal}
              options={useModalOptions('Manage farming pool', true)}
            />
            <RootStack.Screen
              name={ModalsEnum.ManageSavingsPool}
              component={ManageEarnOpportunityModal}
              options={useModalOptions('Manage savings pool', true)}
            />
            <RootStack.Screen
              name={ModalsEnum.Newsletter}
              component={Newsletter}
              options={useModalOptions('Newsletter')}
              listeners={{ beforeRemove: () => dispatch(shouldShowNewsletterModalAction(false)) }}
            />
            <RootStack.Screen
              name={ModalsEnum.InAppBrowser}
              component={InAppBrowser}
              options={useModalOptions('In-App Browser')}
            />
            <RootStack.Screen
              name={ModalsEnum.KoloCard}
              component={KoloCardWidgetModal}
              options={useModalOptions('Crypto Card')}
            />
            <RootStack.Screen
              name={ModalsEnum.ChooseAccountImportType}
              component={ChooseAccountImportType}
              options={useModalOptions('Import account')}
            />
            <RootStack.Screen
              name={ModalsEnum.ChooseWalletImportType}
              component={ChooseWalletImportType}
              options={useModalOptions('Import Existing Wallet')}
            />
            <RootStack.Screen
              name={ModalsEnum.ConfirmSync}
              component={AfterSyncQRScan}
              options={useModalOptions('Confirm Sync')}
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
