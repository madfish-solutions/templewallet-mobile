import React, { FC, useContext } from 'react';
import { Dimensions, StatusBar, View } from 'react-native';

import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { isIOS } from '../../config/system';
import { useHeaderHeight } from '../../hooks/use-header-height.hook';
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

  const isStackFocused = (screensStack: ScreensEnum[]) =>
    isDefined(currentRouteName) && screensStack.includes(currentRouteName);

  const isHidden = isDefined(currentRouteName) && screensWithoutTabBar.includes(currentRouteName);

  const headerHeightFromHook = useHeaderHeight();
  const headerHeight = isIOS ? headerHeightFromHook : StatusBar.currentHeight ?? 0;

  const { layoutHeight, handleLayout } = useLayoutSizes();
  const offset = Dimensions.get('window').height - headerHeight - layoutHeight;

  return isHidden ? null : (
    <View style={[styles.container, { top: offset }]} onLayout={handleLayout}>
      <View style={styles.buttonsContainer}>
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
