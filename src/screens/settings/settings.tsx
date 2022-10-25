import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { Alert, Share, Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { OctopusWithLove } from '../../components/octopus-with-love/octopus-with-love';
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
import { useIsSeedPhraseVerified } from '../../store/security/security-selectors';
import { changeTheme } from '../../store/settings/settings-actions';
import { useFiatCurrencySelector, useThemeSelector } from '../../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { AnalyticsEventCategory } from '../../utils/analytics/analytics-event.enum';
import { usePageAnalytic, useAnalytics } from '../../utils/analytics/use-analytics.hook';
import { SettingsHeader } from './settings-header/settings-header';
import { SettingsSelectors } from './settings.selectors';
import { useSettingsStyles } from './settings.styles';

const SHARE_CONTENT =
  'Hey friend! You should download Temple and discover the Tezos world with me https://templewallet.com/mobile';

export const Settings = () => {
  const styles = useSettingsStyles();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const resetHandler = useResetDataHandler();
  const fiatCurrency = useFiatCurrencySelector();
  const isVerified = useIsSeedPhraseVerified();

  const { trackEvent } = useAnalytics();

  const theme = useThemeSelector();
  const publicKeyHash = useSelectedAccountSelector().publicKeyHash;

  const selectedThemeIndex = theme === ThemesEnum.light ? 0 : 1;

  usePageAnalytic(ScreensEnum.Settings);

  const handleThemeSegmentControlChange = (newThemeIndex: number) =>
    dispatch(changeTheme(newThemeIndex === 0 ? ThemesEnum.light : ThemesEnum.dark));

  const handleShare = useCallback(() => {
    trackEvent(SettingsSelectors.Share, AnalyticsEventCategory.ButtonPress);
    Share.share({
      message: SHARE_CONTENT
    })
      .then(() => {
        trackEvent(SettingsSelectors.ShareSuccess, AnalyticsEventCategory.ButtonPress);
      })
      .catch(() => {
        trackEvent(SettingsSelectors.ShareError, AnalyticsEventCategory.ButtonPress);
      });
  }, [trackEvent]);

  const handleLogoutButtonPress = () => {
    if (isVerified === false) {
      Alert.alert(
        'Are you sure you want to reset the Temple Wallet?',
        'You have not backed up you wallet, as result your data will be lost.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: resetHandler
          }
        ]
      );

      return;
    }
    resetHandler();
  };

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
            {isVerified === false && (
              <>
                <WhiteContainerDivider />
                <WhiteContainerAction onPress={() => navigate(ScreensEnum.BackupSettings)}>
                  <View style={styles.actionsContainer}>
                    <WhiteContainerText text="Backup" />
                  </View>
                  <View style={styles.shevronContainer}>
                    <View style={styles.notificationCircle}>
                      <Text style={styles.notificationText}>1</Text>
                    </View>
                    <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
                  </View>
                </WhiteContainerAction>
              </>
            )}
          </WhiteContainer>
          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction onPress={() => navigate(ScreensEnum.FiatSettings)}>
              <WhiteContainerText text="Default Currency" />
              <View style={styles.shevronContainer}>
                <Text style={styles.shevronText}>{fiatCurrency}</Text>
                <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
              </View>
            </WhiteContainerAction>
            <WhiteContainerDivider />
            <WhiteContainerAction disabled={true}>
              <WhiteContainerText text="Appearance" />

              <TextSegmentControl
                selectedIndex={selectedThemeIndex}
                values={['Light', 'Dark']}
                width={formatSize(120)}
                onChange={handleThemeSegmentControlChange}
              />
            </WhiteContainerAction>

            <WhiteContainerDivider />

            <WhiteContainerAction onPress={() => navigate(ScreensEnum.SecureSettings)}>
              <View style={styles.actionsContainer}>
                <WhiteContainerText text="Secure" />
              </View>
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>
          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction onPress={() => navigate(ScreensEnum.DAppsSettings)}>
              <WhiteContainerText text="Authorized DApps" />
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>
          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction onPress={() => navigate(ScreensEnum.NodeSettings)}>
              <WhiteContainerText text="Default node (RPC)" />
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>
          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction onPress={() => navigate(ScreensEnum.About)}>
              <WhiteContainerText text="About" />
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
            <WhiteContainerDivider />
            <WhiteContainerAction onPress={handleShare}>
              <WhiteContainerText text="Share Temple Wallet" />
              <Icon name={IconNameEnum.Share} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>
          <Divider />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutButtonPress}>
            <Text style={styles.logoutButtonText}>Reset wallet</Text>
            <Icon name={IconNameEnum.LogOut} />
          </TouchableOpacity>
          <Divider />
        </View>
        {!isTablet() && <OctopusWithLove />}
      </ScreenContainer>
    </>
  );
};
