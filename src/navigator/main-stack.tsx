import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { emptyComponent } from '../config/general';
import { ConfirmationWindow } from '../screens/confirmation-window/confirmation-window';
import { CreateAccount } from '../screens/create-account/create-account';
import { DelegationScreen } from '../screens/delegation-screen/delegation-screen';
import { EnterPassword } from '../screens/enter-password/enter-password';
import { ImportAccount } from '../screens/import-account/import-account';
import { ManageAccounts } from '../screens/manage-accounts/manage-accounts';
import { Settings } from '../screens/settings/settings';
import { TezosTokenScreen } from '../screens/tezos-token-screen/tezos-token-screen';
import { TokenScreen } from '../screens/token-screen/token-screen';
import { Wallet } from '../screens/wallet/wallet';
import { Welcome } from '../screens/welcome/welcome';
import { useAppLock } from '../shelter/use-app-lock.hook';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';
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
      <MainStack.Navigator screenOptions={styleScreenOptions}>
        {!isAuthorised ? (
          <>
            <MainStack.Screen name={ScreensEnum.Welcome} component={Welcome} options={{ headerShown: false }} />
            <MainStack.Screen name={ScreensEnum.ImportAccount} component={ImportAccount} />
            <MainStack.Screen name={ScreensEnum.CreateAccount} component={CreateAccount} />
          </>
        ) : (
          <>
            {/** Wallet stack **/}
            <MainStack.Screen
              name={ScreensEnum.Wallet}
              component={Wallet}
              options={{ animationEnabled: false, headerShown: false }}
            />
            <MainStack.Screen name={ScreensEnum.TezosTokenScreen} component={TezosTokenScreen} />
            <MainStack.Screen name={ScreensEnum.TokenScreen} component={TokenScreen} />
            <MainStack.Screen name={ScreensEnum.Delegation} component={DelegationScreen} />

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
            <MainStack.Screen name={ScreensEnum.ManageAccounts} component={ManageAccounts} />
          </>
        )}
      </MainStack.Navigator>

      {isAuthorised && <TabBar />}

      {isAuthorised && (
        <>
          {isLocked && <EnterPassword />}
          {isConfirmation && <ConfirmationWindow />}
        </>
      )}
    </>
  );
};
