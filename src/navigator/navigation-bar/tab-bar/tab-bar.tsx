import React, { memo, useCallback } from 'react';
import { View } from 'react-native';

import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { InternetConnectionStatus } from 'src/components/internet-connection-status';
import { LIMIT_DAPPS_FEATURES, LIMIT_FIN_FEATURES, LIMIT_NFT_FEATURES } from 'src/config/system';
import { ScreensOrModalsEnum } from 'src/interfaces/stacks.interface';
import {
  dAppsStackScreens,
  marketStackScreens,
  nftStackScreens,
  ScreensEnum,
  swapStackScreens,
  walletStackScreens
} from 'src/navigator/enums/screens.enum';
import { showErrorToast } from 'src/toast/toast.utils';
import { isStackFocused } from 'src/utils/is-stack-focused.util';

import { NavigationBarIconNameEnum } from '../navigation-bar-icon/icon-name.enum';
import { NOT_AVAILABLE_MESSAGE, useSwapScreenParams } from '../utils';

import { TabBarButton } from './tab-bar-button/tab-bar-button';
import { useTabBarStyles } from './tab-bar.styles';

interface Props {
  currentRouteName: ScreensOrModalsEnum;
}

export const TabBar = memo<Props>(({ currentRouteName }) => {
  const styles = useTabBarStyles();

  const swapScreenParams = useSwapScreenParams(currentRouteName);

  const isStackFocusedMemo = useCallback(
    (screensStack: ScreensOrModalsEnum[]) => isStackFocused(currentRouteName, screensStack),
    [currentRouteName]
  );

  const handleDisabledPress = useCallback(() => showErrorToast({ description: NOT_AVAILABLE_MESSAGE }), []);

  return (
    <>
      <InternetConnectionStatus />
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          <TabBarButton
            label="Wallet"
            iconName={NavigationBarIconNameEnum.Wallet}
            routeName={ScreensEnum.Wallet}
            focused={isStackFocusedMemo(walletStackScreens)}
          />
          <TabBarButton
            label={LIMIT_NFT_FEATURES ? 'Collectibles' : 'NFT'}
            iconName={NavigationBarIconNameEnum.Nft}
            routeName={ScreensEnum.CollectiblesHome}
            focused={isStackFocusedMemo(nftStackScreens)}
            disabledOnPress={handleDisabledPress}
          />
          {!LIMIT_FIN_FEATURES && (
            <TabBarButton
              label="Swap"
              iconName={NavigationBarIconNameEnum.Swap}
              routeName={ScreensEnum.SwapScreen}
              swapScreenParams={swapScreenParams}
              focused={isStackFocusedMemo(swapStackScreens)}
              disabledOnPress={handleDisabledPress}
            />
          )}
          <TabBarButton
            label={LIMIT_DAPPS_FEATURES ? 'Explore' : 'DApps'}
            iconName={NavigationBarIconNameEnum.DApps}
            routeName={ScreensEnum.DApps}
            focused={isStackFocusedMemo(dAppsStackScreens)}
            disabledOnPress={handleDisabledPress}
          />
          <TabBarButton
            label="Market"
            iconName={NavigationBarIconNameEnum.Market}
            routeName={ScreensEnum.Market}
            focused={isStackFocusedMemo(marketStackScreens)}
          />
        </View>
        <InsetSubstitute type="bottom" />
      </View>
    </>
  );
});
