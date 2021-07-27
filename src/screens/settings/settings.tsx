import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef } from 'react';
import { Alert, Text, useColorScheme, View } from 'react-native';
import { displaySettings } from 'react-native-android-open-settings';
import { getManufacturer } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { useBiometryAvailability } from '../../biometry/use-biometry-availability.hook';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { MadeWithLove } from '../../components/made-with-love/made-with-love';
import { Quote } from '../../components/quote/quote';
import { RobotIcon } from '../../components/robot-icon/robot-icon';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { WhiteContainer } from '../../components/white-container/white-container';
import { WhiteContainerAction } from '../../components/white-container/white-container-action/white-container-action';
import { WhiteContainerDivider } from '../../components/white-container/white-container-divider/white-container-divider';
import { WhiteContainerText } from '../../components/white-container/white-container-text/white-container-text';
import { useResetDataHandler } from '../../hooks/use-reset-data-handler.hook';
import { ThemesEnum } from '../../interfaces/theme.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { changeTheme } from '../../store/settings/settings-actions';
import { useThemeSelector } from '../../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { SettingsHeader } from './settings-header/settings-header';
import { useSettingsStyles } from './settings.styles';

export const Settings = () => {
  const styles = useSettingsStyles();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const handleLogoutButtonPress = useResetDataHandler();
  const { isHardwareAvailable } = useBiometryAvailability();

  const colorScheme = useColorScheme();
  const theme = useThemeSelector();
  const prevThemeRef = useRef(theme);
  const publicKeyHash = useSelectedAccountSelector().publicKeyHash;

  const selectedThemeIndex = theme === ThemesEnum.light ? 0 : 1;

  const handleThemeSegmentControlChange = (newThemeIndex: number) =>
    dispatch(changeTheme(newThemeIndex === 0 ? ThemesEnum.light : ThemesEnum.dark));

  useEffect(() => {
    if (prevThemeRef.current === ThemesEnum.dark && theme === ThemesEnum.light && colorScheme === 'dark') {
      getManufacturer().then(manufacturer => {
        const mayBeStillDark = manufacturer.toLowerCase() === 'xiaomi';
        if (mayBeStillDark) {
          Alert.alert(
            'Switching to light theme',
            "If colors are still dark, go to display settings and disable dark theme for 'Temple' app in 'More dark mode options' menu",
            [{ text: 'No, thanks' }, { text: 'Go to settings', onPress: () => displaySettings() }]
          );
        }
      });
    }
    prevThemeRef.current = theme;
  }, [theme, colorScheme]);

  return (
    <>
      <SettingsHeader />

      <ScreenContainer isFullScreenMode={true}>
        <View style={styles.upperContainer}>
          <View style={styles.quoteContainer}>
            <Quote quote="Buy on the peak = ride on the dick." author="Furry Hamster" />
          </View>
          <Divider size={formatSize(8)} />

          <WhiteContainer>
            <WhiteContainerAction onPress={() => navigate(ScreensEnum.ManageAccounts)}>
              <View style={styles.actionsContainer}>
                <RobotIcon seed={publicKeyHash} size={formatSize(32)} />
                <WhiteContainerText text="Accounts" />
              </View>
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>
          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction disabled={true}>
              <WhiteContainerText text="Appearance" />

              <TextSegmentControl
                selectedIndex={selectedThemeIndex}
                values={['Light', 'Dark']}
                width={formatSize(120)}
                onChange={handleThemeSegmentControlChange}
              />
            </WhiteContainerAction>

            {isHardwareAvailable && (
              <>
                <WhiteContainerDivider />

                <WhiteContainerAction onPress={() => navigate(ScreensEnum.SecureSettings)}>
                  <View style={styles.actionsContainer}>
                    <WhiteContainerText text="Secure" />
                  </View>
                  <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
                </WhiteContainerAction>
              </>
            )}
          </WhiteContainer>
          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction onPress={() => navigate(ScreensEnum.DAppsSettings)}>
              <WhiteContainerText text="DApps" />
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>
          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction onPress={() => navigate(ScreensEnum.About)}>
              <WhiteContainerText text="About" />
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>
          <Divider />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutButtonPress}>
            <Text style={styles.logoutButtonText}>LOG OUT</Text>
            <Icon name={IconNameEnum.LogOut} />
          </TouchableOpacity>
          <Divider />
        </View>

        <MadeWithLove />
      </ScreenContainer>
    </>
  );
};
