import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { ScrollView, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { OctopusWithLove } from 'src/components/octopus-with-love/octopus-with-love';
import { isIOS } from 'src/config/system';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useTotalBalance } from 'src/hooks/use-total-balance';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
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
import { getTokenParams, NOT_AVAILABLE_MESSAGE, RouteParams } from '../tab-bar/tab-bar';
import { SideBarButton } from './side-bar-button/side-bar-button';
import { useSideBarStyles } from './side-bar.styles';

interface Props {
  currentRouteName: ScreensEnum;
}

export const SideBar: FC<Props> = ({ currentRouteName }) => {
  const styles = useSideBarStyles();

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
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View>
          <InsetSubstitute />
          <Divider size={formatSize(8)} />
          <SideBarButton
            label="Wallet"
            iconName={IconNameEnum.TezWallet}
            routeName={ScreensEnum.Wallet}
            focused={isStackFocused(walletStackScreens)}
          />
          <SideBarButton
            label="NFT"
            iconName={IconNameEnum.NFT}
            routeName={ScreensEnum.CollectiblesHome}
            focused={isStackFocused(nftStackScreens)}
            disabledOnPress={disabledOnPress}
          />
          <SideBarButton
            label="Swap"
            iconName={IconNameEnum.Swap}
            routeName={ScreensEnum.SwapScreen}
            focused={isStackFocused(swapStackScreens)}
            disabled={isDcpNode || (isIOS && new BigNumber(balance).isLessThanOrEqualTo(0))}
            onPress={() => swapDisclaimerOverlayController.open()}
            disabledOnPress={isDcpNode ? disabledOnPress : undefined}
          />
          <SideBarButton
            label="DApps"
            iconName={IconNameEnum.DApps}
            routeName={ScreensEnum.DApps}
            focused={isStackFocused(dAppsStackScreens)}
            disabled={isDcpNode || (isIOS && new BigNumber(balance).isLessThanOrEqualTo(0))}
            disabledOnPress={isDcpNode ? disabledOnPress : undefined}
          />
          <SideBarButton
            label="Market"
            iconName={IconNameEnum.Market}
            routeName={ScreensEnum.Market}
            focused={isStackFocused(marketStackScreens)}
          />
        </View>

        <View>
          <OctopusWithLove />
          <Divider size={formatSize(8)} />
          <InsetSubstitute type="bottom" />
        </View>
      </ScrollView>
      <SwapDisclaimerOverlay controller={swapDisclaimerOverlayController} routeParams={params} />
    </View>
  );
};
