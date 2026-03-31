import { PortalProvider } from '@gorhom/portal';
import { createStackNavigator } from '@react-navigation/stack';
import React, { memo, useMemo } from 'react';

import { exolixScreenOptions } from 'src/components/header/exolix-screen-options';
import { generateScreenOptions } from 'src/components/header/generate-screen-options.util';
import { HeaderAction } from 'src/components/header/header-action/header-actions';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { HeaderTokenInfo } from 'src/components/header/header-token-info/header-token-info';
import { ScreenStatusBar } from 'src/components/screen-status-bar/screen-status-bar';
import { emptyFn } from 'src/config/general';
import { transparent } from 'src/config/styles';
import { LIMIT_FIN_FEATURES } from 'src/config/system';
import { useMainHooks } from 'src/hooks/main-hooks';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { SecurityUpdate } from 'src/modals/security-update';
import { About } from 'src/screens/about/about';
import { Activity } from 'src/screens/activity/activity';
import { Backup } from 'src/screens/backup/backup';
import { Buy } from 'src/screens/buy/buy';
import { BuyWithCreditCard } from 'src/screens/buy/buy-with-credit-card';
import { Exolix } from 'src/screens/buy/crypto/exolix/exolix';
import { CloudBackup } from 'src/screens/cloud-backup';
import { CollectiblesHome } from 'src/screens/collectibles-home/collectibles-home';
import { Collection } from 'src/screens/collection';
import { Contacts } from 'src/screens/contacts/contacts';
import { ContinueWithCloud } from 'src/screens/continue-with-cloud';
import { CreateNewWallet } from 'src/screens/create-new-wallet/create-new-wallet';
import { DApps } from 'src/screens/d-apps/d-apps';
import { DAppsSettings } from 'src/screens/d-apps-settings/d-apps-settings';
import { Debug } from 'src/screens/debug/debug';
import { DelegationScreen } from 'src/screens/delegation-screen/delegation-screen';
import { Earn } from 'src/screens/earn';
import { Farming } from 'src/screens/farming';
import { FiatSettings } from 'src/screens/fiat-settings/fiat-settings';
import { ManageAccounts } from 'src/screens/manage-accounts/manage-accounts';
import { ManageAssets } from 'src/screens/manage-assets/manage-assets';
import { ManualBackup } from 'src/screens/manual-backup/manual-backup';
import { Market } from 'src/screens/market/market';
import { NodeSettings } from 'src/screens/node-settings/node-settings';
import { Notifications } from 'src/screens/notifications/notifications';
import { NotificationsItem } from 'src/screens/notifications-item/notifications-item';
import { NotificationsSettings } from 'src/screens/notifications-settings/notifications-settings';
import { Savings } from 'src/screens/savings';
import { ScanQrCode } from 'src/screens/scan-qr-code/scan-qr-code';
import { SecureSettings } from 'src/screens/secure-settings/secure-settings';
import { Settings } from 'src/screens/settings/settings';
import { SwapSettingsScreen } from 'src/screens/swap/settings/swap-settings';
import { SwapScreen } from 'src/screens/swap/swap';
import { TezosTokenScreen } from 'src/screens/tezos-token-screen/tezos-token-screen';
import { TokenInfo } from 'src/screens/token-info/token-info';
import { TokenScreen } from 'src/screens/token-screen/token-screen';
import { Wallet } from 'src/screens/wallet/wallet';
import { Welcome } from 'src/screens/welcome/welcome';
import { useAppLock } from 'src/shelter/app-lock/app-lock';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';
import { useColors } from 'src/styles/use-colors';
import { emptyTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { cloudTitle } from 'src/utils/cloud-backup';

import { ScreensEnum, ScreensParamList } from './enums/screens.enum';
import { useStackNavigatorStyleOptions } from './hooks/use-stack-navigator-style-options.hook';
import { NavigationBar } from './navigation-bar/navigation-bar';

const MainStack = createStackNavigator<ScreensParamList>();

export const MainStackScreen = memo(() => {
  const isAuthorised = useIsAuthorisedSelector();
  const { isLocked } = useAppLock();

  const styleScreenOptions = useStackNavigatorStyleOptions();
  const colors = useColors();

  const tokenScreenHeaderStyle = useMemo(
    () => ({
      backgroundColor: colors.navigation,
      borderBottomWidth: 0,
      shadowColor: transparent
    }),
    [colors]
  );

  const { metadata } = useNetworkInfo();

  useMainHooks(isLocked, isAuthorised);

  const shouldShowUnauthorizedScreens = !isAuthorised;
  const shouldShowAuthorizedScreens = isAuthorised && !isLocked;
  const shouldShowBlankScreen = isAuthorised && isLocked;

  return (
    <PortalProvider>
      <ScreenStatusBar />

      <NavigationBar>
        <MainStack.Navigator screenOptions={styleScreenOptions}>
          {shouldShowUnauthorizedScreens ? (
            <>
              <MainStack.Screen name={ScreensEnum.Welcome} component={Welcome} options={{ headerShown: false }} />
              <MainStack.Screen
                name={ScreensEnum.CreateAccount}
                component={CreateNewWallet}
                options={generateScreenOptions(<HeaderTitle title="Create a new Wallet" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.ContinueWithCloud}
                component={ContinueWithCloud}
                options={generateScreenOptions(<HeaderTitle title={`Restore from ${cloudTitle}`} />)}
              />
            </>
          ) : null}
          {shouldShowAuthorizedScreens ? (
            <>
              {/** Wallet stack **/}
              <MainStack.Screen
                name={ScreensEnum.Wallet}
                component={Wallet}
                options={{ animation: 'none', headerShown: false }}
              />
              <MainStack.Screen
                name={ScreensEnum.CollectiblesHome}
                component={CollectiblesHome}
                options={{ animation: 'none', headerShown: false }}
              />
              <MainStack.Screen
                name={ScreensEnum.TezosTokenScreen}
                component={TezosTokenScreen}
                options={generateScreenOptions(
                  <HeaderTokenInfo token={metadata} />,
                  null,
                  true,
                  tokenScreenHeaderStyle
                )}
              />
              <MainStack.Screen
                name={ScreensEnum.TokenScreen}
                component={TokenScreen}
                options={generateScreenOptions(
                  <HeaderTokenInfo token={emptyTokenMetadata} />,
                  null,
                  true,
                  tokenScreenHeaderStyle
                )}
              />
              <MainStack.Screen
                name={ScreensEnum.TokenInfo}
                component={TokenInfo}
                options={generateScreenOptions(<HeaderTitle title="Token Info" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Delegation}
                component={DelegationScreen}
                options={generateScreenOptions(<HeaderTitle title="Delegate & Stake" />)}
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
                name={ScreensEnum.Notifications}
                component={Notifications}
                options={generateScreenOptions(<HeaderTitle title="Notifications" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.NotificationsItem}
                component={NotificationsItem}
                options={generateScreenOptions(<HeaderTitle title="Notifications" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Buy}
                component={Buy}
                options={generateScreenOptions(<HeaderTitle title="Top up balance" />)}
              />

              <MainStack.Screen
                name={ScreensEnum.Earn}
                component={Earn}
                options={generateScreenOptions(<HeaderTitle title="Earn" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Farming}
                component={Farming}
                options={generateScreenOptions(<HeaderTitle title="Farming" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Savings}
                component={Savings}
                options={generateScreenOptions(<HeaderTitle title="Savings" />)}
              />

              <MainStack.Screen name={ScreensEnum.Exolix} component={Exolix} options={exolixScreenOptions()} />

              <MainStack.Screen
                name={ScreensEnum.BuyWithCreditCard}
                component={BuyWithCreditCard}
                options={generateScreenOptions(<HeaderTitle title="Top up balance" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Collection}
                component={Collection}
                options={({ route: { params } }) =>
                  generateScreenOptions(<HeaderTitle title={`${params.collectionName}`} />)
                }
              />

              {/** DApps stack **/}
              <MainStack.Screen
                name={ScreensEnum.DApps}
                component={DApps}
                options={{ animation: 'none', headerShown: false }}
              />

              {/** Swap stack **/}
              {!LIMIT_FIN_FEATURES && (
                <>
                  <MainStack.Screen
                    name={ScreensEnum.SwapScreen}
                    component={SwapScreen}
                    options={{
                      ...generateScreenOptions(<HeaderTitle title="Swap" />, <HeaderAction />, false),
                      animation: 'none'
                    }}
                  />

                  <MainStack.Screen
                    name={ScreensEnum.SwapSettingsScreen}
                    component={SwapSettingsScreen}
                    options={generateScreenOptions(<HeaderTitle title="Swap Settings" />)}
                  />
                </>
              )}

              {/** Market stack **/}
              <MainStack.Screen
                name={ScreensEnum.Market}
                component={Market}
                options={{ animation: 'none', headerShown: false }}
              />

              {/** Settings stack **/}
              <MainStack.Screen
                name={ScreensEnum.Settings}
                component={Settings}
                options={{ animation: 'none', headerShown: false }}
              />
              <MainStack.Screen
                name={ScreensEnum.ManageAccounts}
                component={ManageAccounts}
                options={generateScreenOptions(<HeaderTitle title="Manage Accounts" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Contacts}
                component={Contacts}
                options={generateScreenOptions(<HeaderTitle title="Contacts" />)}
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
                name={ScreensEnum.Backup}
                component={Backup}
                options={generateScreenOptions(<HeaderTitle title="Backup" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.ManualBackup}
                component={ManualBackup}
                options={generateScreenOptions(<HeaderTitle title="Manual backup" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.CloudBackup}
                component={CloudBackup}
                options={generateScreenOptions(<HeaderTitle title={`Backup to ${cloudTitle}`} />)}
              />
              <MainStack.Screen
                name={ScreensEnum.NotificationsSettings}
                component={NotificationsSettings}
                options={generateScreenOptions(<HeaderTitle title="Notifications and Ads" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Debug}
                component={Debug}
                options={generateScreenOptions(<HeaderTitle title="Debugging" />)}
              />

              <MainStack.Screen
                name={ScreensEnum.SecurityUpdate}
                component={SecurityUpdate}
                options={generateScreenOptions(<HeaderTitle title="Update info" />)}
              />
            </>
          ) : null}

          {shouldShowBlankScreen ? (
            <MainStack.Screen name={ScreensEnum.Blank} options={{ headerShown: false }}>
              {emptyFn}
            </MainStack.Screen>
          ) : null}

          <MainStack.Screen
            name={ScreensEnum.ScanQrCode}
            component={ScanQrCode}
            options={generateScreenOptions(<HeaderTitle title="Scan QR Code" />)}
          />
        </MainStack.Navigator>
      </NavigationBar>
    </PortalProvider>
  );
});
