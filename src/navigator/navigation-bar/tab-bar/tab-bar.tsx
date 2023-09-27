import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useMemo } from 'react';
import { View } from 'react-native';

import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { isIOS } from 'src/config/system';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useTotalBalance } from 'src/hooks/use-total-balance';
import { ScreensOrModalsEnum } from 'src/interfaces/stacks.interface';
import {
  dAppsStackScreens,
  marketStackScreens,
  nftStackScreens,
  ScreensEnum,
  swapStackScreens,
  walletStackScreens
} from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { SwapDisclaimerOverlay } from 'src/screens/swap/swap-disclaimer-overlay/swap-disclaimer-overlay';
import { useIsSwapDisclaimerShowingSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';
import { isStackFocused } from 'src/utils/is-stack-focused.util';

import { TabBarButton } from './tab-bar-button/tab-bar-button';
import { useTabBarStyles } from './tab-bar.styles';

type RouteType = { params?: { token: TokenInterface } };
export type RouteParams = { name: string } & RouteType;

export const NOT_AVAILABLE_MESSAGE = 'Not available on this RPC node';

interface Props {
  currentRouteName: ScreensOrModalsEnum;
}

export const TabBar: FC<Props> = ({ currentRouteName }) => {
  const styles = useTabBarStyles();

  const { isDcpNode } = useNetworkInfo();
  const { balance } = useTotalBalance();
  const { getState } = useNavigation();

  const swapDisclaimerOverlayController = useBottomSheetController();
  const isSwapDisclaimerShowing = useIsSwapDisclaimerShowingSelector();

  const routes = getState().routes[0].state?.routes;
  const route = getTokenParams(routes as RouteParams[]);

  const swapScreenParams =
    isDefined(route) && currentRouteName === ScreensEnum.TokenScreen ? { inputToken: route.params?.token } : undefined;

  const isStackFocusedMemo = useCallback(
    (screensStack: ScreensOrModalsEnum[]) => isStackFocused(currentRouteName, screensStack),
    [currentRouteName]
  );

  const isSwapButtonDisabled = useMemo(
    () => isDcpNode || (isIOS && new BigNumber(balance).isLessThanOrEqualTo(0)),
    [isDcpNode, balance]
  );

  const handleDisabledPress = useCallback(() => showErrorToast({ description: NOT_AVAILABLE_MESSAGE }), []);

  return (
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
          label="NFT"
          iconName={IconNameEnum.NFT}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.CollectiblesHome}
          focused={isStackFocusedMemo(nftStackScreens)}
          disabledOnPress={handleDisabledPress}
        />
        <TabBarButton
          label="Swap"
          iconName={IconNameEnum.Swap}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.SwapScreen}
          swapScreenParams={swapScreenParams}
          focused={isStackFocusedMemo(swapStackScreens)}
          disabled={isSwapButtonDisabled}
          onSwapButtonPress={isIOS && isSwapDisclaimerShowing ? swapDisclaimerOverlayController.open : undefined}
          disabledOnPress={handleDisabledPress}
        />
        <TabBarButton
          label="DApps"
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
      <SwapDisclaimerOverlay controller={swapDisclaimerOverlayController} routeParams={swapScreenParams} />
    </View>
  );
};

export const getTokenParams = (routes: RouteParams[] | undefined): null | RouteType => {
  let result = null;
  if (Array.isArray(routes) && isDefined(routes)) {
    for (const route of routes) {
      if (route.name === ScreensEnum.TokenScreen) {
        result = route;
      }
    }
  }

  return result;
};
