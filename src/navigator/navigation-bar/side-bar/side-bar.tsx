import React, { FC } from 'react';
import { ScrollView, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { OctopusWithLove } from 'src/components/octopus-with-love/octopus-with-love';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';

import { ScreensOrModalsEnum } from '../../../interfaces/stacks.interface';
import { isStackFocused } from '../../../utils/is-stack-focused.util';
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
  currentRouteName: ScreensOrModalsEnum;
}

export const NOT_AVAILABLE_MESSAGE = 'Not available on this RPC node';

export const SideBar: FC<Props> = ({ currentRouteName }) => {
  const styles = useSideBarStyles();

  const { isDcpNode } = useNetworkInfo();

  const disabledOnPress = () => showErrorToast({ description: NOT_AVAILABLE_MESSAGE });

  const getIsFocused = (stack: ScreensOrModalsEnum[]) => isStackFocused(currentRouteName, stack);

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
            focused={getIsFocused(walletStackScreens)}
          />
          <SideBarButton
            label="NFT"
            iconName={IconNameEnum.NFT}
            routeName={ScreensEnum.CollectiblesHome}
            focused={getIsFocused(nftStackScreens)}
            disabledOnPress={disabledOnPress}
          />
          <SideBarButton
            label="Swap"
            iconName={IconNameEnum.Swap}
            routeName={ScreensEnum.SwapScreen}
            focused={getIsFocused(swapStackScreens)}
            disabled={isDcpNode}
            disabledOnPress={disabledOnPress}
          />
          <SideBarButton
            label="DApps"
            iconName={IconNameEnum.DApps}
            routeName={ScreensEnum.DApps}
            focused={getIsFocused(dAppsStackScreens)}
            disabled={isDcpNode}
            disabledOnPress={disabledOnPress}
          />
          <SideBarButton
            label="Market"
            iconName={IconNameEnum.Market}
            routeName={ScreensEnum.Market}
            focused={getIsFocused(marketStackScreens)}
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
