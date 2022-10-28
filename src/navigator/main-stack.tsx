import { PortalProvider } from '@gorhom/portal';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useDispatch } from 'react-redux';

import { useBeaconHandler } from '../beacon/use-beacon-handler.hook';
import { exolixScreenOptions } from '../components/header/exolix-screen-options';
import { generateIntegratedAppOptions } from '../components/header/generate-integrated-dapp-options.util';
import { generateScreenOptions } from '../components/header/generate-screen-options.util';
import { HeaderAction } from '../components/header/header-action/header-actions';
import { HeaderModal } from '../components/header/header-modal/header-modal';
import { HeaderTitle } from '../components/header/header-title/header-title';
import { HeaderTokenInfo } from '../components/header/header-token-info/header-token-info';
import { ScreenStatusBar } from '../components/screen-status-bar/screen-status-bar';
import { useBlockSubscription } from '../hooks/block-subscription/use-block-subscription.hook';
import { useAdvertising } from '../hooks/use-advertising.hook';
import { useAppLockTimer } from '../hooks/use-app-lock-timer.hook';
import { useFirebaseApp } from '../hooks/use-firebase-app.hook';
import { useNetworkInfo } from '../hooks/use-network-info.hook';
import { useAuthorisedTimerEffect } from '../hooks/use-timer-effect.hook';
import { About } from '../screens/about/about';
import { Activity } from '../screens/activity/activity';
import { Buy } from '../screens/buy/buy';
import { Exolix } from '../screens/buy/crypto/exolix/exolix';
import { AliceBob } from '../screens/buy/debit/alice-bob/alice-bob';
import { Utorg } from '../screens/buy/debit/utorg/utorg';
import { CollectiblesHome } from '../screens/collectibles-home/collectibles-home';
import { CreateAccount } from '../screens/create-account/create-account';
import { DAppsSettings } from '../screens/d-apps-settings/d-apps-settings';
import { DApps } from '../screens/d-apps/d-apps';
import { Debug } from '../screens/debug/debug';
import { DelegationScreen } from '../screens/delegation-screen/delegation-screen';
import { FiatSettings } from '../screens/fiat-settings/fiat-settings';
import { ImportAccount } from '../screens/import-account/import-account';
import { LiquidityBakingDapp } from '../screens/liquidity-baking-dapp/liquidity-baking-dapp';
import { ManageAccounts } from '../screens/manage-accounts/manage-accounts';
import { ManageAssets } from '../screens/manage-assets/manage-assets';
import { NodeSettings } from '../screens/node-settings/node-settings';
import { ScanQrCode } from '../screens/scan-qr-code/scan-qr-code';
import { SecureSettings } from '../screens/secure-settings/secure-settings';
import { Settings } from '../screens/settings/settings';
import { SwapQuestionsScreen } from '../screens/swap/quesrtion/swap-questions';
import { SwapSettingsScreen } from '../screens/swap/settings/swap-settings';
import { SwapScreen } from '../screens/swap/swap';
import { AfterSyncQRScan } from '../screens/sync-account/after-sync-qr-scan/after-sync-qr-scan';
import { SyncInstructions } from '../screens/sync-account/sync-instructions/sync-instructions';
import { TezosTokenScreen } from '../screens/tezos-token-screen/tezos-token-screen';
import { TokenScreen } from '../screens/token-screen/token-screen';
import { Wallet } from '../screens/wallet/wallet';
import { Welcome } from '../screens/welcome/welcome';
import { loadSelectedBakerActions } from '../store/baking/baking-actions';
import { loadExchangeRates } from '../store/currency/currency-actions';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { loadTezosBalanceActions, loadTokensActions } from '../store/wallet/wallet-actions';
import { useIsAuthorisedSelector, useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { emptyTokenMetadata } from '../token/interfaces/token-metadata.interface';
import { ScreensEnum, ScreensParamList } from './enums/screens.enum';
import { useStackNavigatorStyleOptions } from './hooks/use-stack-navigator-style-options.hook';
import { NavigationBar } from './navigation-bar/navigation-bar';

const MainStack = createStackNavigator<ScreensParamList>();

const DATA_REFRESH_INTERVAL = 60 * 1000;
const LONG_REFRESH_INTERVAL = 5 * 60 * 1000;

export const MainStackScreen = () => {
  const dispatch = useDispatch();
  const isAuthorised = useIsAuthorisedSelector();
  const selectedAccount = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const styleScreenOptions = useStackNavigatorStyleOptions();

  const blockSubscription = useBlockSubscription();

  const { metadata } = useNetworkInfo();

  useAppLockTimer();
  useBeaconHandler();
  useFirebaseApp();
  useAdvertising();

  const initDataLoading = () => {
    dispatch(loadTezosBalanceActions.submit());
    dispatch(loadTokensActions.submit());
    dispatch(loadSelectedBakerActions.submit());
  };
  const initLongRefreshLoading = () => {
    dispatch(loadExchangeRates.submit());
  };

  useAuthorisedTimerEffect(initDataLoading, DATA_REFRESH_INTERVAL, [
    blockSubscription.block.header,
    selectedAccount.publicKeyHash,
    selectedRpcUrl
  ]);
  useAuthorisedTimerEffect(initLongRefreshLoading, LONG_REFRESH_INTERVAL, [selectedAccount.publicKeyHash]);

  return (
    <PortalProvider>
      <ScreenStatusBar />

      <NavigationBar>
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
                name={ScreensEnum.SyncInstructions}
                component={SyncInstructions}
                options={generateScreenOptions(<HeaderTitle title="Sync" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.ConfirmSync}
                component={AfterSyncQRScan}
                options={generateScreenOptions(<HeaderTitle title="Confirm Sync" />)}
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
                name={ScreensEnum.CollectiblesHome}
                component={CollectiblesHome}
                options={{
                  headerShown: false,
                  gestureDirection: 'horizontal-inverted'
                }}
              />
              <MainStack.Screen
                name={ScreensEnum.TezosTokenScreen}
                component={TezosTokenScreen}
                options={generateScreenOptions(<HeaderTokenInfo token={metadata} />)}
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
                component={DApps}
                options={{ animationEnabled: false, headerShown: false }}
              />
              <MainStack.Screen
                name={ScreensEnum.LiquidityBakingDapp}
                component={LiquidityBakingDapp}
                options={generateIntegratedAppOptions(<HeaderModal />)}
              />

              {/** Buy stack **/}
              <MainStack.Screen
                name={ScreensEnum.Buy}
                component={Buy}
                options={generateScreenOptions(<HeaderTitle title={`Top up ${metadata.symbol} balance`} />)}
              />

              <MainStack.Screen
                name={ScreensEnum.AliceBob}
                component={AliceBob}
                options={generateScreenOptions(<HeaderTitle title={`Top up ${metadata.symbol} balance`} />)}
              />

              <MainStack.Screen
                name={ScreensEnum.Utorg}
                component={Utorg}
                options={generateScreenOptions(<HeaderTitle title={`Top up ${metadata.symbol} balance`} />)}
              />

              <MainStack.Screen name={ScreensEnum.Exolix} component={Exolix} options={exolixScreenOptions()} />

              {/** Swap stack **/}
              <MainStack.Screen
                name={ScreensEnum.SwapScreen}
                component={SwapScreen}
                options={{
                  ...generateScreenOptions(<HeaderTitle title="Swap" />, <HeaderAction />, false),
                  animationEnabled: false
                }}
              />

              <MainStack.Screen
                name={ScreensEnum.SwapSettingsScreen}
                component={SwapSettingsScreen}
                options={generateScreenOptions(<HeaderTitle title="Swap Settings" />)}
              />

              <MainStack.Screen
                name={ScreensEnum.SwapQuestionsScreen}
                component={SwapQuestionsScreen}
                options={generateScreenOptions(<HeaderTitle title="Swap Questions" />)}
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
                options={generateScreenOptions(<HeaderTitle title="Authorized DApps" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.NodeSettings}
                component={NodeSettings}
                options={generateScreenOptions(<HeaderTitle title="Default node (RPC)" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.FiatSettings}
                component={FiatSettings}
                options={generateScreenOptions(<HeaderTitle title="Default currency" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.SecureSettings}
                component={SecureSettings}
                options={generateScreenOptions(<HeaderTitle title="Secure" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Debug}
                component={Debug}
                options={generateScreenOptions(<HeaderTitle title="Debugging" />)}
              />
            </>
          )}
          <MainStack.Screen
            name={ScreensEnum.ScanQrCode}
            component={ScanQrCode}
            options={generateScreenOptions(<HeaderTitle title="Scan QR Code" />)}
          />
        </MainStack.Navigator>
      </NavigationBar>
    </PortalProvider>
  );
};
