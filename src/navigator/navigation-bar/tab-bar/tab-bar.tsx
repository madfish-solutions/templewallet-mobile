import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { View } from 'react-native';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { isIOS } from 'src/config/system';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useTotalBalance } from 'src/hooks/use-total-balance';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';

import { useBottomSheetController } from '../../../components/bottom-sheet/use-bottom-sheet-controller';
import { SwapDisclaimerOverlay } from '../../../screens/swap/swap-disclaimer-overlay/swap-disclaimer-overlay';
import {
  dAppsStackScreens,
  marketStackScreens,
  nftStackScreens,
  ScreensEnum,
  swapStackScreens,
  walletStackScreens
} from '../../enums/screens.enum';
import { useNavigation } from '../../hooks/use-navigation.hook';
import { TabBarButton } from './tab-bar-button/tab-bar-button';
import { useTabBarStyles } from './tab-bar.styles';

type RouteType = { params?: { token: TokenInterface } };
export type RouteParams = { name: string } & RouteType;

export const NOT_AVAILABLE_MESSAGE = 'Not available on this RPC node';

interface Props {
  currentRouteName: ScreensEnum;
}

export const TabBar: FC<Props> = ({ currentRouteName }) => {
  const styles = useTabBarStyles();

  const { isDcpNode } = useNetworkInfo();

  const { balance } = useTotalBalance();

  const { getState } = useNavigation();

  const swapDisclaimerOverlayController = useBottomSheetController();

  const routes = getState().routes[0].state?.routes;
  const route = getTokenParams(routes as RouteParams[]);
  const params =
    isDefined(route) && currentRouteName === ScreensEnum.TokenScreen ? { inputToken: route.params?.token } : undefined;

  const isStackFocused = (screensStack: ScreensEnum[]) =>
    isDefined(currentRouteName) && screensStack.includes(currentRouteName);

  const disabledOnPress = () => showErrorToast({ description: NOT_AVAILABLE_MESSAGE });

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
          disabledOnPress={disabledOnPress}
        />
        <TabBarButton
          label="Swap"
          iconName={IconNameEnum.Swap}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.SwapScreen}
          params={params}
          focused={isStackFocused(swapStackScreens)}
          disabled={isDcpNode || (isIOS && new BigNumber(balance).isLessThanOrEqualTo(0))}
          onPress={() => swapDisclaimerOverlayController.open()}
          disabledOnPress={isDcpNode ? disabledOnPress : undefined}
        />
        <TabBarButton
          label="DApps"
          iconName={IconNameEnum.DApps}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.DApps}
          focused={isStackFocused(dAppsStackScreens)}
          disabled={isDcpNode}
          disabledOnPress={disabledOnPress}
        />
        <TabBarButton
          label="Market"
          iconName={IconNameEnum.Market}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.Market}
          focused={isStackFocused(marketStackScreens)}
          disabledOnPress={disabledOnPress}
        />
      </View>
      <InsetSubstitute type="bottom" />
      <SwapDisclaimerOverlay controller={swapDisclaimerOverlayController} routeParams={params} />
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
