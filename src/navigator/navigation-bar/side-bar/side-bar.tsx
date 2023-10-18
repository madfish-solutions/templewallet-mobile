import React, { FC, useCallback } from 'react';
import { ScrollView, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { OctopusWithLove } from 'src/components/octopus-with-love/octopus-with-love';
import { isAndroid } from 'src/config/system';
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
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { isDefined } from 'src/utils/is-defined';
import { isStackFocused } from 'src/utils/is-stack-focused.util';

import { getTokenParams, NOT_AVAILABLE_MESSAGE, RouteParams } from '../tab-bar/tab-bar';
import { SideBarButton } from './side-bar-button/side-bar-button';
import { useSideBarStyles } from './side-bar.styles';

interface Props {
  currentRouteName: ScreensOrModalsEnum;
}

export const SideBar: FC<Props> = ({ currentRouteName }) => {
  const styles = useSideBarStyles();

  const { isDcpNode } = useNetworkInfo();
  const { getState } = useNavigation();

  const routes = getState().routes[0].state?.routes;
  const route = getTokenParams(routes as RouteParams[]);
  const swapScreenParams =
    isDefined(route) && currentRouteName === ScreensEnum.TokenScreen ? { inputToken: route.params?.token } : undefined;

  const isStackFocusedMemo = useCallback(
    (screensStack: ScreensOrModalsEnum[]) => isStackFocused(currentRouteName, screensStack),
    [currentRouteName]
  );

  const handleDisabledPress = useCallback(() => showErrorToast({ description: NOT_AVAILABLE_MESSAGE }), []);

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
            focused={isStackFocusedMemo(walletStackScreens)}
          />
          <SideBarButton
            label="NFT"
            iconName={IconNameEnum.NFT}
            routeName={ScreensEnum.CollectiblesHome}
            focused={isStackFocusedMemo(nftStackScreens)}
            disabledOnPress={handleDisabledPress}
          />
          {isAndroid && (
            <SideBarButton
              label="Swap"
              iconName={IconNameEnum.Swap}
              routeName={ScreensEnum.SwapScreen}
              swapScreenParams={swapScreenParams}
              focused={isStackFocusedMemo(swapStackScreens)}
              disabled={isDcpNode}
              disabledOnPress={handleDisabledPress}
            />
          )}
          <SideBarButton
            label="DApps"
            iconName={IconNameEnum.DApps}
            routeName={ScreensEnum.DApps}
            focused={isStackFocusedMemo(dAppsStackScreens)}
            disabled={isDcpNode}
            disabledOnPress={handleDisabledPress}
          />
          <SideBarButton
            label="Market"
            iconName={IconNameEnum.Market}
            routeName={ScreensEnum.Market}
            focused={isStackFocusedMemo(marketStackScreens)}
          />
        </View>

        <View>
          <OctopusWithLove />
          <Divider size={formatSize(8)} />
          <InsetSubstitute type="bottom" />
        </View>
      </ScrollView>
    </View>
  );
};
