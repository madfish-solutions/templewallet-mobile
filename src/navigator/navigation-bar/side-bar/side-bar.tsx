import React, { FC } from 'react';
import { ScrollView, View } from 'react-native';

import { DebugTapListener } from '../../../components/debug-tap-listener/debug-tap-listener';
import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { OctopusWithLove } from '../../../components/octopus-with-love/octopus-with-love';
import { formatSize } from '../../../styles/format-size';
import { isDefined } from '../../../utils/is-defined';
import {
  dAppsStackScreens,
  ScreensEnum,
  settingsStackScreens,
  swapStackScreens,
  walletStackScreens
} from '../../enums/screens.enum';
import { SideBarButton } from './side-bar-button/side-bar-button';
import { useSideBarStyles } from './side-bar.styles';

interface Props {
  currentRouteName: ScreensEnum;
}

export const SideBar: FC<Props> = ({ currentRouteName }) => {
  const styles = useSideBarStyles();

  const isStackFocused = (screensStack: ScreensEnum[]) =>
    isDefined(currentRouteName) && screensStack.includes(currentRouteName);

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
            label="DApps"
            iconName={IconNameEnum.SoonBadge}
            routeName={ScreensEnum.DApps}
            focused={isStackFocused(dAppsStackScreens)}
            disabled={true}
          />
          <SideBarButton
            label="Swap"
            iconName={IconNameEnum.SoonBadge}
            routeName={ScreensEnum.Swap}
            focused={isStackFocused(swapStackScreens)}
            disabled={true}
          />
          <DebugTapListener>
            <SideBarButton
              label="Settings"
              iconName={IconNameEnum.Settings}
              routeName={ScreensEnum.Settings}
              focused={isStackFocused(settingsStackScreens)}
            />
          </DebugTapListener>
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
