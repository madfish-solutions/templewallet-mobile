import { PortalProvider } from '@gorhom/portal';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { generateScreenOptions } from '../components/header/generate-screen-options.util';
import { HeaderQrScannerButton } from '../components/header/header-qr-scanner-button/header-qr-scanner-button';
import { HeaderTitle } from '../components/header/header-title/header-title';
import { HeaderTokenInfo } from '../components/header/header-token-info/header-token-info';
import { emptyComponent } from '../config/general';
import { About } from '../screens/about/about';
import { Activity } from '../screens/activity/Activity';
import { ConfirmationWindow } from '../screens/confirmation-window/confirmation-window';
import { CreateAccount } from '../screens/create-account/create-account';
import { DelegationScreen } from '../screens/delegation-screen/delegation-screen';
import { EnterPassword } from '../screens/enter-password/enter-password';
import { ImportAccount } from '../screens/import-account/import-account';
import { ManageAccounts } from '../screens/manage-accounts/manage-accounts';
import { ManageAssets } from '../screens/manage-assets/manage-assets';
import { Settings } from '../screens/settings/settings';
import { TezosTokenScreen } from '../screens/tezos-token-screen/tezos-token-screen';
import { TokenScreen } from '../screens/token-screen/token-screen';
import { Wallet } from '../screens/wallet/wallet';
import { Welcome } from '../screens/welcome/welcome';
import { useAppLock } from '../shelter/use-app-lock.hook';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';
import { XTZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { emptyTokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { ScreensEnum, ScreensParamList } from './screens.enum';
import { TabBar } from './tab-bar/tab-bar';
import { useStackNavigatorStyleOptions } from './use-stack-navigator-style-options.hook';

const MainStack = createStackNavigator<ScreensParamList>();

const isConfirmation = false;

export const MainStackScreen = () => {
  const { isLocked } = useAppLock();
  const isAuthorised = useIsAuthorisedSelector();
  const styleScreenOptions = useStackNavigatorStyleOptions();

  return (
    <>
      <PortalProvider>
        <MainStack.Navigator screenOptions={styleScreenOptions}>
          {!isAuthorised ? (
            <>
              <MainStack.Screen name={ScreensEnum.Welcome} component={Welcome} options={{ headerShown: false }} />
              <MainStack.Screen
                name={ScreensEnum.ImportAccount}
                component={ImportAccount}
                options={generateScreenOptions(<HeaderTitle title="Import existing Wallet" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.CreateAccount}
                component={CreateAccount}
                options={generateScreenOptions(<HeaderTitle title="Create a new Wallet" />)}
              />
            </>
          ) : (
            <>
              {/** Wallet stack **/}
              <MainStack.Screen
                name={ScreensEnum.Wallet}
                component={Wallet}
                options={{ animationEnabled: false, headerShown: false }}
              />
              <MainStack.Screen
                name={ScreensEnum.TezosTokenScreen}
                component={TezosTokenScreen}
                options={generateScreenOptions(
                  <HeaderTokenInfo token={XTZ_TOKEN_METADATA} />,
                  <HeaderQrScannerButton />
                )}
              />
              <MainStack.Screen
                name={ScreensEnum.TokenScreen}
                component={TokenScreen}
                options={generateScreenOptions(
                  <HeaderTokenInfo token={emptyTokenMetadataInterface} />,
                  <HeaderQrScannerButton />
                )}
              />
              <MainStack.Screen
                name={ScreensEnum.Delegation}
                component={DelegationScreen}
                options={generateScreenOptions(<HeaderTitle title="Delegation" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.ManageAssets}
                component={ManageAssets}
                options={generateScreenOptions(<HeaderTitle title="Manage Assets" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Activity}
                component={Activity}
                options={generateScreenOptions(<HeaderTitle title="Activity" />)}
              />

              {/** DApps stack **/}
              <MainStack.Screen
                name={ScreensEnum.DApps}
                component={emptyComponent}
                options={{ animationEnabled: false }}
              />

              {/** Swap stack **/}
              <MainStack.Screen
                name={ScreensEnum.Swap}
                component={emptyComponent}
                options={{ animationEnabled: false }}
              />

              {/** Settings stack **/}
              <MainStack.Screen
                name={ScreensEnum.Settings}
                component={Settings}
                options={{ animationEnabled: false, headerShown: false }}
              />
              <MainStack.Screen
                name={ScreensEnum.ManageAccounts}
                component={ManageAccounts}
                options={generateScreenOptions(<HeaderTitle title="Manage Accounts" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.About}
                component={About}
                options={generateScreenOptions(<HeaderTitle title="About" />)}
              />
            </>
          )}
        </MainStack.Navigator>

        {isAuthorised && <TabBar />}
      </PortalProvider>

      {isAuthorised && (
        <>
          {isLocked && <EnterPassword />}
          {isConfirmation && <ConfirmationWindow />}
        </>
      )}
    </>
  );
};
