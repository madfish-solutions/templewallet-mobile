import React, { memo, useCallback } from 'react';
import { ScrollView, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { InternetConnectionStatus } from 'src/components/internet-connection-status';
import { OctopusWithLove } from 'src/components/octopus-with-love/octopus-with-love';
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

import { SideBarButton } from './side-bar-button/side-bar-button';
import { useSideBarStyles } from './side-bar.styles';

interface Props {
  currentRouteName: ScreensOrModalsEnum;
}

export const SideBar = memo<Props>(({ currentRouteName }) => {
  const styles = useSideBarStyles();

  const { isDcpNode } = useNetworkInfo();

  const swapScreenParams = useSwapScreenParams(currentRouteName);

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
            label={LIMIT_NFT_FEATURES ? 'Collectibles' : 'NFT'}
            iconName={IconNameEnum.NFT}
            routeName={ScreensEnum.CollectiblesHome}
            focused={isStackFocusedMemo(nftStackScreens)}
            disabledOnPress={handleDisabledPress}
          />
          {!LIMIT_FIN_FEATURES && (
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
            label={LIMIT_DAPPS_FEATURES ? 'Explore' : 'DApps'}
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
          <InternetConnectionStatus sideBar />
          <InsetSubstitute type="bottom" />
        </View>
      </ScrollView>
    </View>
  );
});
