import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { Share, Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { NotificationCounter } from '../../components/notification-counter/notification-counter';
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
import { changeTheme } from '../../store/settings/settings-actions';
import {
  useFiatCurrencySelector,
  useIsManualBackupMadeSelector,
  useThemeSelector
} from '../../store/settings/settings-selectors';
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
  const handleLogoutButtonPress = useResetDataHandler();
  const fiatCurrency = useFiatCurrencySelector();
  const isManualBackupMade = useIsManualBackupMadeSelector();

  const { trackEvent } = useAnalytics();

  const theme = useThemeSelector();
  const publicKeyHash = useSelectedAccountSelector().publicKeyHash;

  const selectedThemeIndex = theme === ThemesEnum.light ? 0 : 1;

  usePageAnalytic(ScreensEnum.Settings);

  const handleThemeSegmentControlChange = (newThemeIndex: number) =>
    dispatch(changeTheme(newThemeIndex === 0 ? ThemesEnum.light : ThemesEnum.dark));

  const handleShare = useCallback(() => {
    trackEvent(SettingsSelectors.shareTempleWalletButton, AnalyticsEventCategory.ButtonPress);
    Share.share({
      message: SHARE_CONTENT
    })
      .then(() => {
        trackEvent(SettingsSelectors.shareSuccess, AnalyticsEventCategory.ButtonPress);
      })
      .catch(() => {
        trackEvent(SettingsSelectors.shareError, AnalyticsEventCategory.ButtonPress);
      });
  }, [trackEvent]);

  return (
    <>
      <SettingsHeader />

      <ScreenContainer isFullScreenMode={true}>
        <View style={styles.upperContainer}>
          <View style={styles.quoteContainer}>
            <Quote quote="It’s money 2.0, a huge, huge, huge deal." author="Chamath Palihapitiya" />
          </View>

          <Divider size={formatSize(8)} />

          <WhiteContainer>
            <WhiteContainerAction
              onPress={() => navigate(ScreensEnum.ManageAccounts)}
              testID={SettingsSelectors.accountsButton}
            >
              <View style={styles.actionsContainer}>
                <RobotIcon seed={publicKeyHash} size={formatSize(32)} />
                <WhiteContainerText text="Accounts" />
              </View>
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
            <WhiteContainerAction
              onPress={() => navigate(ScreensEnum.Contacts)}
              testID={SettingsSelectors.contactsButton}
            >
              <WhiteContainerText text="Contacts" />
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
            {!isManualBackupMade && (
              <>
                <WhiteContainerDivider />
                <WhiteContainerAction onPress={() => navigate(ScreensEnum.Backup)}>
                  <View style={styles.actionsContainer}>
                    <WhiteContainerText text="Backup" />
                  </View>
                  <View style={styles.actionsContainer}>
                    <NotificationCounter count={1} />
                    <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
                  </View>
                </WhiteContainerAction>
              </>
            )}
          </WhiteContainer>

          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction
              onPress={() => navigate(ScreensEnum.FiatSettings)}
              testID={SettingsSelectors.defaultCurrencyButton}
            >
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
                testID={SettingsSelectors.appearanceToggle}
              />
            </WhiteContainerAction>
          </WhiteContainer>

          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction
              onPress={() => navigate(ScreensEnum.NotificationsSettings)}
              testID={SettingsSelectors.notificationsButton}
            >
              <View style={styles.actionsContainer}>
                <WhiteContainerText text="Notifications and Ads" />
              </View>
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>

            <WhiteContainerDivider />

            <WhiteContainerAction
              onPress={() => navigate(ScreensEnum.SecureSettings)}
              testID={SettingsSelectors.secureButton}
            >
              <View style={styles.actionsContainer}>
                <WhiteContainerText text="Secure" />
              </View>
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>

            <WhiteContainerDivider />

            <WhiteContainerAction
              onPress={() => navigate(ScreensEnum.DAppsSettings)}
              testID={SettingsSelectors.authorizedDAppsButton}
            >
              <WhiteContainerText text="Authorized DApps" />
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>

            <WhiteContainerDivider />

            <WhiteContainerAction
              onPress={() => navigate(ScreensEnum.NodeSettings)}
              testID={SettingsSelectors.defaultNodeRPCButton}
            >
              <WhiteContainerText text="Default node (RPC)" />
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>

          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction onPress={() => navigate(ScreensEnum.About)} testID={SettingsSelectors.aboutButton}>
              <WhiteContainerText text="About" />
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>

            <WhiteContainerDivider />

            <WhiteContainerAction onPress={handleShare} testID={SettingsSelectors.shareTempleWalletButton}>
              <WhiteContainerText text="Share Temple Wallet" />
              <Icon name={IconNameEnum.Share} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>

          <Divider />

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutButtonPress}
            testID={SettingsSelectors.resetWalletButton}
          >
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
