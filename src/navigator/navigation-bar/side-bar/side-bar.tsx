import React, { FC, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native';

import { DebugTapListener } from '../../../components/debug-tap-listener/debug-tap-listener';
import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { OctopusWithLove } from '../../../components/octopus-with-love/octopus-with-love';
import { isAndroid } from '../../../config/system';
import { useNetworkInfo } from '../../../hooks/use-network-info.hook';
import { formatSize } from '../../../styles/format-size';
import { showErrorToast } from '../../../toast/toast.utils';
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

export const NOT_AVAILABLE_MESSAGE = 'Not available on this RPC node';

export const SideBar: FC<Props> = ({ currentRouteName }) => {
  const styles = useSideBarStyles();

  const { isDcpNode } = useNetworkInfo();

  const isStackFocused = (screensStack: ScreensEnum[]) =>
    isDefined(currentRouteName) && screensStack.includes(currentRouteName);

  const disabledOnPress = () => showErrorToast({ description: NOT_AVAILABLE_MESSAGE });

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      if (isDefined(currentRouteName) && currentRouteName === ScreensEnum.SwapScreen) {
        setKeyboardVisible(true); // or some other action
      }
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
            iconName={IconNameEnum.DApps}
            routeName={ScreensEnum.DApps}
            focused={isStackFocused(dAppsStackScreens)}
            disabled={isDcpNode}
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
        <KeyboardAvoidingView
          keyboardVerticalOffset={isAndroid ? formatSize(60) : formatSize(50)}
          behavior="padding"
          style={{
            height: formatSize(44)
          }}
        >
          {isKeyboardVisible && <View style={styles.keyboardContainer} />}
          {/* <View style={styles.keyboardContainer} /> */}
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
