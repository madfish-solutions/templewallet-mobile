import { Serializer } from '@airgap/beacon-sdk';
import { PortalProvider } from '@gorhom/portal';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { URL } from 'react-native-url-polyfill';
import { useDispatch } from 'react-redux';

import { BeaconHandler, isBeaconMessage } from '../beacon/beacon-handler';
import { generateScreenOptions } from '../components/header/generate-screen-options.util';
import { HeaderTitle } from '../components/header/header-title/header-title';
import { HeaderTokenInfo } from '../components/header/header-token-info/header-token-info';
import { emptyComponent } from '../config/general';
import { ConfirmationTypeEnum } from '../interfaces/confirm-payload/confirmation-type.enum';
import { About } from '../screens/about/about';
import { Activity } from '../screens/activity/activity';
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
import { loadActivityGroupsActions } from '../store/activity/activity-actions';
import { loadSelectedBakerActions } from '../store/baking/baking-actions';
import { loadTezosBalanceActions, loadTokenBalancesActions } from '../store/wallet/wallet-actions';
import { useIsAuthorisedSelector, useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { XTZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { emptyTokenMetadata } from '../token/interfaces/token-metadata.interface';
import { isDefined } from '../utils/is-defined';
import { ModalsEnum } from './enums/modals.enum';
import { ScreensEnum, ScreensParamList } from './enums/screens.enum';
import { useNavigation } from './hooks/use-navigation.hook';
import { useStackNavigatorStyleOptions } from './hooks/use-stack-navigator-style-options.hook';
import { TabBar } from './tab-bar/tab-bar';

const MainStack = createStackNavigator<ScreensParamList>();

const isConfirmation = false;

const DATA_REFRESH_INTERVAL = 60 * 1000;

export const MainStackScreen = () => {
  const dispatch = useDispatch();
  const { isLocked } = useAppLock();
  const { navigate } = useNavigation();
  const isAuthorised = useIsAuthorisedSelector();
  const selectedAccount = useSelectedAccountSelector();
  const styleScreenOptions = useStackNavigatorStyleOptions();

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

  useEffect(() => {
    BeaconHandler.init(message => {
      console.log('puuk', message);
      navigate(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.DAppOperations, message });
    });

    const listener = async ({ url }: { url: string }) => {
      try {
        const searchParams = new URL(url).searchParams;
        const type = searchParams.get('type');
        const data = searchParams.get('data');

        if (type === 'tzip10' && isDefined(data)) {
          const json = await new Serializer().deserialize(data);
          if (isBeaconMessage(json)) {
            await BeaconHandler.addPeer(json);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    Linking.addEventListener('url', listener);

    return () => Linking.removeEventListener('url', listener);
  }, []);

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
                options={generateScreenOptions(<HeaderTokenInfo token={XTZ_TOKEN_METADATA} />)}
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
