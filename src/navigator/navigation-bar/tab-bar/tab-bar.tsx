import React, { memo, useCallback } from 'react';
import { View } from 'react-native';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { InternetConnectionStatus } from 'src/components/internet-connection-status';
import { LIMIT_DAPPS_FEATURES, LIMIT_FIN_FEATURES, LIMIT_NFT_FEATURES } from 'src/config/system';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ScreensOrModalsEnum } from 'src/interfaces/stacks.interface';
import {
  dAppsStackScreens,
  marketStackScreens,
  nftStackScreens,
  ScreensEnum,
  swapStackScreens,
  walletStackScreens
} from 'src/navigator/enums/screens.enum';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { isStackFocused } from 'src/utils/is-stack-focused.util';

import { NOT_AVAILABLE_MESSAGE, useSwapScreenParams } from '../utils';

import { TabBarButton } from './tab-bar-button/tab-bar-button';
import { useTabBarStyles } from './tab-bar.styles';

interface Props {
  currentRouteName: ScreensOrModalsEnum;
}

export const TabBar = memo<Props>(({ currentRouteName }) => {
  const styles = useTabBarStyles();

  const { isDcpNode } = useNetworkInfo();

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
            iconName={IconNameEnum.TezWallet}
            iconWidth={formatSize(28)}
            routeName={ScreensEnum.Wallet}
            focused={isStackFocusedMemo(walletStackScreens)}
          />
          <TabBarButton
            label={LIMIT_NFT_FEATURES ? 'Collectibles' : 'NFT'}
            iconName={IconNameEnum.NFT}
            iconWidth={formatSize(32)}
            routeName={ScreensEnum.CollectiblesHome}
            focused={isStackFocusedMemo(nftStackScreens)}
            disabledOnPress={handleDisabledPress}
          />
          {!LIMIT_FIN_FEATURES && (
            <TabBarButton
              label="Swap"
              iconName={IconNameEnum.Swap}
              iconWidth={formatSize(32)}
              routeName={ScreensEnum.SwapScreen}
              swapScreenParams={swapScreenParams}
              focused={isStackFocusedMemo(swapStackScreens)}
              disabled={isDcpNode}
              disabledOnPress={handleDisabledPress}
            />
          )}
          <TabBarButton
            label={LIMIT_DAPPS_FEATURES ? 'Explore' : 'DApps'}
            iconName={IconNameEnum.DApps}
            iconWidth={formatSize(32)}
            routeName={ScreensEnum.DApps}
            focused={isStackFocusedMemo(dAppsStackScreens)}
            disabled={isDcpNode}
            disabledOnPress={handleDisabledPress}
          />
          <TabBarButton
            label="Market"
            iconName={IconNameEnum.Market}
            iconWidth={formatSize(32)}
            routeName={ScreensEnum.Market}
            focused={isStackFocusedMemo(marketStackScreens)}
          />
        </View>
        <InsetSubstitute type="bottom" />
      </View>
    </>
  );
});
