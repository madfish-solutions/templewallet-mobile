import retry from 'async-retry';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';

import { getKoloWidgetUrl } from 'src/apis/kolo';
import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { setKoloForceLogoutOnNextOpenAction } from 'src/store/settings/settings-actions';
import { useKoloForceLogoutOnNextOpenSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking';

import { useKoloCardWidgetModalStyles } from './kolo-card-widget-modal.styles';

const KOLO_MOCK_EMAIL = 'example@gmail.com';
const KOLO_ABOUT_LINK = 'https://docs.templewallet.com/card/';
const KOLO_SUPPORT_URL = 'https://t.me/KoloHelpBot';

interface HeaderMenuButtonProps {
  onPress: EmptyFn;
  style?: ViewStyle;
}

enum LogoutReinitStage {
  Idle = 0,
  LoadWithMockEmail = 1,
  ReloadWithoutOverride = 2
}

const HeaderMenuButton: FC<HeaderMenuButtonProps> = ({ onPress, style }) => (
  <TouchableIcon name={IconNameEnum.MoreHorizontal} onPress={onPress} style={style} />
);

export const KoloCardWidgetModal: FC = () => {
  const dispatch = useDispatch();
  const styles = useKoloCardWidgetModalStyles();
  const forceLogout = useKoloForceLogoutOnNextOpenSelector();

  usePageAnalytic(ModalsEnum.KoloCard);

  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailOverride, setEmailOverride] = useState<string | null>(null);
  const [logoutReinitStage, setLogoutReinitStage] = useState<LogoutReinitStage>(LogoutReinitStage.Idle);

  const menuBottomSheetController = useBottomSheetController();

  const performLogout = useCallback(() => {
    /*
     2-step re-init:
     stage 1: load once with mock email to drop KOLO session
     stage 2: auto reload without email, so KOLO can prefill from its account data
    */
    setLogoutReinitStage(LogoutReinitStage.LoadWithMockEmail);
    setEmailOverride(KOLO_MOCK_EMAIL);
    setWidgetUrl(null);
    setError(null);
    setLoading(false);
  }, []);

  const handleLogout = useCallback(() => {
    menuBottomSheetController.close();
    Alert.alert('Are you sure?', 'You’ll need to log in again to access your account', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: performLogout
      }
    ]);
  }, [menuBottomSheetController, performLogout]);

  const handleAboutPress = useCallback(() => {
    menuBottomSheetController.close();
    openUrl(KOLO_ABOUT_LINK);
  }, [menuBottomSheetController]);

  const handleSupportPress = useCallback(() => {
    menuBottomSheetController.close();
    openUrl(KOLO_SUPPORT_URL);
  }, [menuBottomSheetController]);

  const headerLeft = useCallback(
    () => <HeaderMenuButton onPress={menuBottomSheetController.open} style={styles.menuButton} />,
    [menuBottomSheetController.open, styles.menuButton]
  );

  useNavigationSetOptions({ headerLeft }, [headerLeft]);

  useEffect(() => {
    if (widgetUrl != null || loading || error != null) {
      return;
    }

    if (forceLogout && logoutReinitStage === LogoutReinitStage.Idle) {
      setLogoutReinitStage(LogoutReinitStage.LoadWithMockEmail);
      setEmailOverride(KOLO_MOCK_EMAIL);

      return;
    }

    setLoading(true);

    void (async () => {
      try {
        const url = await retry(
          () =>
            getKoloWidgetUrl({
              email: emailOverride ?? undefined,
              isEmailLocked: false,
              themeColor: 'light',
              hideFeatures: [],
              isPersist: false
            }),
          { retries: 3 }
        );

        setWidgetUrl(url);
        setError(null);
      } catch {
        setError('Failed to load KOLO Card widget. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, [widgetUrl, loading, error, emailOverride, forceLogout, logoutReinitStage]);

  const handleWidgetLoad = useCallback(() => {
    if (logoutReinitStage !== LogoutReinitStage.LoadWithMockEmail) {
      return;
    }
    dispatch(setKoloForceLogoutOnNextOpenAction(false));

    setTimeout(() => {
      setLogoutReinitStage(LogoutReinitStage.ReloadWithoutOverride);
      setEmailOverride(null);
      setWidgetUrl(null);
      setError(null);
    }, 1000);
  }, [logoutReinitStage, dispatch]);

  const isLogoutInProgress = logoutReinitStage === LogoutReinitStage.LoadWithMockEmail;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.container} scrollEnabled alwaysBounceVertical>
        {(loading || isLogoutInProgress) && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" />
          </View>
        )}

        {Boolean(error) && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && error == null && isDefined(widgetUrl) && (
          <View style={[styles.webView, isLogoutInProgress && styles.webViewHidden]}>
            <WebView
              source={{ uri: widgetUrl }}
              style={styles.webView}
              setSupportMultipleWindows={false}
              bounces={false}
              overScrollMode="never"
              onLoad={handleWidgetLoad}
            />
          </View>
        )}
      </ScrollView>

      <BottomSheet description="More" contentHeight={formatSize(274)} controller={menuBottomSheetController}>
        <BottomSheetActionButton
          title="About"
          iconLeftName={IconNameEnum.AlertCircle}
          style={styles.menuActionButton}
          onPress={handleAboutPress}
        />
        <BottomSheetActionButton
          title="Kolo support"
          iconLeftName={IconNameEnum.MessageCircle}
          style={styles.menuActionButton}
          onPress={handleSupportPress}
        />
        <BottomSheetActionButton
          title="Log out"
          iconLeftName={IconNameEnum.LogOut}
          style={styles.menuActionButton}
          titleStyle={styles.logoutText}
          onPress={handleLogout}
        />
      </BottomSheet>
    </>
  );
};
