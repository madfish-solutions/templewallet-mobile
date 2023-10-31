import React, { memo } from 'react';
import { ScrollView, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { OctopusWithLove } from 'src/components/octopus-with-love/octopus-with-love';
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
import { SideBarButton } from './side-bar-button/side-bar-button';
import { useSideBarStyles } from './side-bar.styles';

interface Props {
  currentRouteName: ScreensEnum;
}

export const SideBar = memo<Props>(({ currentRouteName }) => {
  const styles = useSideBarStyles();

  const { isDcpNode, swapScreenParams, isStackFocused, handleDisabledPress } = useNavigationBar(currentRouteName);

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
            disabledOnPress={handleDisabledPress}
          />
          {isAndroid && (
            <SideBarButton
              label="Swap"
              iconName={IconNameEnum.Swap}
              routeName={ScreensEnum.SwapScreen}
              swapScreenParams={swapScreenParams}
              focused={isStackFocused(swapStackScreens)}
              disabled={isDcpNode}
              disabledOnPress={isDcpNode ? handleDisabledPress : undefined}
            />
          )}
          <SideBarButton
            label="DApps"
            iconName={IconNameEnum.DApps}
            routeName={ScreensEnum.DApps}
            focused={isStackFocused(dAppsStackScreens)}
            disabled={isDcpNode}
            disabledOnPress={handleDisabledPress}
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
    </View>
  );
});
