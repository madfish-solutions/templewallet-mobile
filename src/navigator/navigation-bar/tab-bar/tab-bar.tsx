import React, { FC } from 'react';
import { View } from 'react-native';

import { DebugTapListener } from '../../../components/debug-tap-listener/debug-tap-listener';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { formatSize } from '../../../styles/format-size';
import { isDefined } from '../../../utils/is-defined';
import {
  dAppsStackScreens,
  ScreensEnum,
  settingsStackScreens,
  swapStackScreens,
  walletStackScreens
} from '../../enums/screens.enum';
import { TabBarButton } from './tab-bar-button/tab-bar-button';
import { useTabBarStyles } from './tab-bar.styles';

interface Props {
  currentRouteName: ScreensEnum;
}

export const TabBar: FC<Props> = ({ currentRouteName }) => {
  const styles = useTabBarStyles();

  const isStackFocused = (screensStack: ScreensEnum[]) =>
    isDefined(currentRouteName) && screensStack.includes(currentRouteName);

  return (
    <View style={styles.container}>
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
          iconName={IconNameEnum.DApps}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.DApps}
          focused={isStackFocused(dAppsStackScreens)}
          disabled={true}
        />
        <TabBarButton
          label="Swap"
          iconName={IconNameEnum.Swap}
          iconWidth={formatSize(32)}
          routeName={ScreensEnum.Swap}
          focused={isStackFocused(swapStackScreens)}
          disabled={true}
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
