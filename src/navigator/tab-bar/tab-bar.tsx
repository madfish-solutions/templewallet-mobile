import React, { FC, useContext } from 'react';
import { StatusBar, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { useLayoutSizes } from '../../hooks/use-layout-sizes.hook';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { CurrentRouteNameContext } from '../current-route-name.context';
import {
  dAppsStackScreens,
  ScreensEnum,
  settingsStackScreens,
  swapStackScreens,
  walletStackScreens
} from '../enums/screens.enum';
import { TabBarButton } from './tab-bar-button/tab-bar-button';
import { useTabBarStyles } from './tab-bar.styles';

const screensWithoutTabBar = [ScreensEnum.ScanQrCode];

export const TabBar: FC = () => {
  const styles = useTabBarStyles();
  const currentRouteName = useContext(CurrentRouteNameContext);
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const { layoutHeight, handleLayout } = useLayoutSizes();

  const isStackFocused = (screensStack: ScreensEnum[]) =>
    isDefined(currentRouteName) && screensStack.includes(currentRouteName);

  const isHidden = isDefined(currentRouteName) && screensWithoutTabBar.includes(currentRouteName);

  const top = dimensions.height - ((StatusBar.currentHeight ?? 0) + layoutHeight + insets.bottom);

  return isHidden ? null : (
    <View style={[styles.container, { top }]}>
      <View style={styles.buttonsContainer} onLayout={handleLayout}>
        <TabBarButton
          label="Wallet"
          iconName={IconNameEnum.TezWallet}
          iconWidth={formatSize(24)}
          routeName={ScreensEnum.Wallet}
          focused={isStackFocused(walletStackScreens)}
        />
        <TabBarButton
          label="DApps"
          iconName={IconNameEnum.SoonBadge}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.DApps}
          focused={isStackFocused(dAppsStackScreens)}
          disabled={true}
        />
        <TabBarButton
          label="Swap"
          iconName={IconNameEnum.SoonBadge}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.Swap}
          focused={isStackFocused(swapStackScreens)}
          disabled={true}
        />
        <TabBarButton
          label="Settings"
          iconName={IconNameEnum.Settings}
          iconWidth={formatSize(22)}
          routeName={ScreensEnum.Settings}
          focused={isStackFocused(settingsStackScreens)}
        />
      </View>
      <InsetSubstitute type="bottom" />
    </View>
  );
};
