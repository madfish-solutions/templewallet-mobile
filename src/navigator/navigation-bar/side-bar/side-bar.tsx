import React, { FC } from 'react';
import { ScrollView, View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { OctopusWithLove } from '../../../components/octopus-with-love/octopus-with-love';
import { useNetworkInfo } from '../../../hooks/use-network-info.hook';
import { formatSize } from '../../../styles/format-size';
import { showErrorToast } from '../../../toast/toast.utils';
import { isDefined } from '../../../utils/is-defined';
import {
  dAppsStackScreens,
  marketStackScreens,
  nftStackScreens,
  ScreensEnum,
  swapStackScreens,
  walletStackScreens
} from '../../enums/screens.enum';
import { SideBarButton } from './side-bar-button/side-bar-button';
import { useSideBarStyles } from './side-bar.styles';

interface Props {
  currentRouteName: ScreensEnum;
}

export const NOT_AVAILABLE_MESSAGE = 'Not available on this RPC node';

export const SideBar: FC<Props> = ({ currentRouteName }) => {
  const styles = useSideBarStyles();

  const { isDcpNode } = useNetworkInfo();

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
            disabled={isDcpNode}
            disabledOnPress={disabledOnPress}
          />
          <SideBarButton
            label="DApps"
            iconName={IconNameEnum.DApps}
            routeName={ScreensEnum.DApps}
            focused={isStackFocused(dAppsStackScreens)}
            disabled={isDcpNode}
            disabledOnPress={disabledOnPress}
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
};
