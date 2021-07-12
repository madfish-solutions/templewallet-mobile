import { PortalProvider } from '@gorhom/portal';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useBeaconHandler } from '../beacon/use-beacon-handler.hook';
import { generateScreenOptions } from '../components/header/generate-screen-options.util';
import { HeaderTitle } from '../components/header/header-title/header-title';
import { HeaderTokenInfo } from '../components/header/header-token-info/header-token-info';
import { emptyComponent } from '../config/general';
import { About } from '../screens/about/about';
import { Activity } from '../screens/activity/activity';
import { CreateAccount } from '../screens/create-account/create-account';
import { DAppsSettings } from '../screens/d-apps-settings/d-apps-settings';
import { DelegationScreen } from '../screens/delegation-screen/delegation-screen';
import { ImportAccount } from '../screens/import-account/import-account';
import { ManageAccounts } from '../screens/manage-accounts/manage-accounts';
import { ManageAssets } from '../screens/manage-assets/manage-assets';
import { ScanQrCode } from '../screens/scan-qr-code/scan-qr-code';
import { SecureSettings } from '../screens/secure-settings/secure-settings';
import { Settings } from '../screens/settings/settings';
import { TezosTokenScreen } from '../screens/tezos-token-screen/tezos-token-screen';
import { TokenScreen } from '../screens/token-screen/token-screen';
import { Wallet } from '../screens/wallet/wallet';
import { Welcome } from '../screens/welcome/welcome';
import { loadActivityGroupsActions } from '../store/activity/activity-actions';
import { loadSelectedBakerActions } from '../store/baking/baking-actions';
import { loadTezosBalanceActions, loadTokenBalancesActions } from '../store/wallet/wallet-actions';
import { useIsAuthorisedSelector, useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { emptyTokenMetadata } from '../token/interfaces/token-metadata.interface';
import { ScreensEnum, ScreensParamList } from './enums/screens.enum';
import { useStackNavigatorStyleOptions } from './hooks/use-stack-navigator-style-options.hook';
import { TabBar } from './tab-bar/tab-bar';

const MainStack = createStackNavigator<ScreensParamList>();

const DATA_REFRESH_INTERVAL = 60 * 1000;

export const MainStackScreen = () => {
  const dispatch = useDispatch();
  const isAuthorised = useIsAuthorisedSelector();
  const selectedAccount = useSelectedAccountSelector();
  const styleScreenOptions = useStackNavigatorStyleOptions();

  useBeaconHandler();
  useEffect(() => {
    if (isAuthorised) {
      let timeoutId = setTimeout(function updateData() {
        dispatch(loadTezosBalanceActions.submit(selectedAccount.publicKeyHash));
        dispatch(loadTokenBalancesActions.submit(selectedAccount.publicKeyHash));
        dispatch(loadActivityGroupsActions.submit(selectedAccount.publicKeyHash));
        dispatch(loadSelectedBakerActions.submit(selectedAccount.publicKeyHash));

        timeoutId = setTimeout(updateData, DATA_REFRESH_INTERVAL);
      }, DATA_REFRESH_INTERVAL);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthorised, selectedAccount.publicKeyHash]);

  return (
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
              options={generateScreenOptions(<HeaderTokenInfo token={TEZ_TOKEN_METADATA} />)}
            />
            <MainStack.Screen
              name={ScreensEnum.TokenScreen}
              component={TokenScreen}
              options={generateScreenOptions(<HeaderTokenInfo token={emptyTokenMetadata} />)}
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
            <MainStack.Screen
              name={ScreensEnum.ScanQrCode}
              component={ScanQrCode}
              options={generateScreenOptions(<HeaderTitle title="Scan QR Code" isWhite={true} />)}
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
            <MainStack.Screen
              name={ScreensEnum.DAppsSettings}
              component={DAppsSettings}
              options={generateScreenOptions(<HeaderTitle title="DApps" />)}
            />
            <MainStack.Screen
              name={ScreensEnum.SecureSettings}
              component={SecureSettings}
              options={generateScreenOptions(<HeaderTitle title="Secure" />)}
            />
          </>
        )}
      </MainStack.Navigator>

      {isAuthorised && <TabBar />}
    </PortalProvider>
  );
};
