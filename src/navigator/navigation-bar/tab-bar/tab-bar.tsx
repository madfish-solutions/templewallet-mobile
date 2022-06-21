import React, { FC } from 'react';
import { View } from 'react-native';

import { DebugTapListener } from '../../../components/debug-tap-listener/debug-tap-listener';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { formatSize } from '../../../styles/format-size';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { isDefined } from '../../../utils/is-defined';
import {
  dAppsStackScreens,
  ScreensEnum,
  settingsStackScreens,
  swapStackScreens,
  walletStackScreens
} from '../../enums/screens.enum';
import { useNavigation } from '../../hooks/use-navigation.hook';
import { TabBarButton } from './tab-bar-button/tab-bar-button';
import { useTabBarStyles } from './tab-bar.styles';

type RouteType = { params?: { token: TokenInterface } };
type RouteParams = { name: string } & RouteType;

interface Props {
  currentRouteName: ScreensEnum;
}

export const TabBar: FC<Props> = ({ currentRouteName }) => {
  const styles = useTabBarStyles();

  const { getState } = useNavigation();

  const routes = getState().routes[0].state?.routes;
  const route = getTokenParams(routes as RouteParams[]);
  const isStackFocused = (screensStack: ScreensEnum[]) =>
    isDefined(currentRouteName) && screensStack.includes(currentRouteName);

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
          label="DApps"
          iconName={IconNameEnum.DApps}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.DApps}
          focused={isStackFocused(dAppsStackScreens)}
        />
        <TabBarButton
          label="Swap"
          iconName={IconNameEnum.Swap}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.SwapScreen}
          params={isDefined(route) && currentRouteName === ScreensEnum.TokenScreen ? route.params : undefined}
          focused={isStackFocused(swapStackScreens)}
        />
        <DebugTapListener>
          <TabBarButton
            label="Settings"
            iconName={IconNameEnum.Settings}
            iconWidth={formatSize(32)}
            routeName={ScreensEnum.Settings}
            focused={isStackFocused(settingsStackScreens)}
          />
        </DebugTapListener>
      </View>
      <InsetSubstitute type="bottom" />
    </View>
  );
};

const getTokenParams = (routes: RouteParams[] | undefined): null | RouteType => {
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
