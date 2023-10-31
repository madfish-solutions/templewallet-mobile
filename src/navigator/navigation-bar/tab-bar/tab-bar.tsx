import React, { memo } from 'react';
import { View } from 'react-native';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { isAndroid } from 'src/config/system';
import {
  dAppsStackScreens,
  marketStackScreens,
  nftStackScreens,
  ScreensEnum,
  swapStackScreens,
  walletStackScreens
} from 'src/navigator/enums/screens.enum';
import { formatSize } from 'src/styles/format-size';

import { useNavigationBar } from '../hooks/use-navigation-bar';
import { TabBarButton } from './tab-bar-button/tab-bar-button';
import { useTabBarStyles } from './tab-bar.styles';

interface Props {
  currentRouteName: ScreensEnum;
}

export const TabBar = memo<Props>(({ currentRouteName }) => {
  const styles = useTabBarStyles();

  const { isDcpNode, swapScreenParams, isStackFocused, handleDisabledPress } = useNavigationBar(currentRouteName);

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TabBarButton
          label="Wallet"
          iconName={IconNameEnum.TezWallet}
          iconWidth={formatSize(28)}
          routeName={ScreensEnum.Wallet}
          focused={isStackFocused(walletStackScreens)}
        />
        <TabBarButton
          label="NFT"
          iconName={IconNameEnum.NFT}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.CollectiblesHome}
          focused={isStackFocused(nftStackScreens)}
          disabledOnPress={handleDisabledPress}
        />
        {isAndroid && (
          <TabBarButton
            label="Swap"
            iconName={IconNameEnum.Swap}
            iconWidth={formatSize(32)}
            routeName={ScreensEnum.SwapScreen}
            swapScreenParams={swapScreenParams}
            focused={isStackFocused(swapStackScreens)}
            disabled={isDcpNode}
            disabledOnPress={isDcpNode ? handleDisabledPress : undefined}
          />
        )}
        <TabBarButton
          label="DApps"
          iconName={IconNameEnum.DApps}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.DApps}
          focused={isStackFocused(dAppsStackScreens)}
          disabled={isDcpNode}
          disabledOnPress={handleDisabledPress}
        />
        <TabBarButton
          label="Market"
          iconName={IconNameEnum.Market}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.Market}
          focused={isStackFocused(marketStackScreens)}
          disabledOnPress={handleDisabledPress}
        />
      </View>
      <InsetSubstitute type="bottom" />
    </View>
  );
});
