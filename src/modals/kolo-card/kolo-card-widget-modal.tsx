import { RouteProp, useRoute } from '@react-navigation/native';
import retry from 'async-retry';
import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, ScrollView, Text, View, ViewStyle } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useDispatch } from 'react-redux';

import { getKoloWidgetUrl } from 'src/apis/kolo';
import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { isAndroid } from 'src/config/system';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { setKoloForceLogoutOnNextOpenAction } from 'src/store/settings/settings-actions';
import { useKoloForceLogoutOnNextOpenSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { openUrl } from 'src/utils/linking';

import { useKoloCardWidgetModalStyles } from './kolo-card-widget-modal.styles';

const KOLO_MOCK_EMAIL = 'example@gmail.com';
const KOLO_ABOUT_LINK = 'https://docs.templewallet.com/card/';
const KOLO_SUPPORT_URL = 'https://t.me/KoloHelpBot';

interface HeaderMenuButtonProps {
  onPress: EmptyFn;
  style?: ViewStyle;
}

const HeaderMenuButton: FC<HeaderMenuButtonProps> = memo(({ onPress, style }) => (
  <TouchableIcon name={IconNameEnum.MoreHorizontal} onPress={onPress} style={style} />
));

export const KoloCardWidgetModal: FC = memo(() => {
  const route = useRoute<RouteProp<ModalsParamList, ModalsEnum.KoloCard>>();
  const { forceLogout: forceLogoutParam = false } = route.params ?? {};

  const dispatch = useDispatch();
  const styles = useKoloCardWidgetModalStyles();
  const koloForceLogoutOnNextOpen = useKoloForceLogoutOnNextOpenSelector();

  const forceLogout = forceLogoutParam || koloForceLogoutOnNextOpen;

  usePageAnalytic(ModalsEnum.KoloCard);

  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailOverride, setEmailOverride] = useState<string | null>(null);
  const [logoutReinitStage, setLogoutReinitStage] = useState<0 | 1 | 2>(0);
  const [webViewKey, setWebViewKey] = useState(0);
  const [navState, setNavState] = useState<WebViewNavigation>();

  const webViewRef = useRef<WebView>(null);
  const canGoBack = navState?.canGoBack ?? false;

  const menuBottomSheetController = useBottomSheetController();

  const performLogout = useCallback(() => {
    /*
     2-step re-init:
     stage 1: load once with mock email to drop KOLO session
     stage 2: auto reload without email, so KOLO can prefill from its account data
    */
    setLogoutReinitStage(1);
    setEmailOverride(KOLO_MOCK_EMAIL);
    setWidgetUrl(null);
    setError(null);
    setLoading(false);
    setWebViewKey(prev => prev + 1);
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
    if (!isAndroid) {
      return;
    }

    const backListener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack) {
        webViewRef.current?.goBack();

        return true;
      }

      return false;
    });

    return () => void backListener.remove();
  }, [canGoBack]);

  useEffect(() => {
    if (widgetUrl != null || loading || error != null) {
      return;
    }

    if (forceLogout && logoutReinitStage === 0) {
      setLogoutReinitStage(1);
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
    if (logoutReinitStage !== 1) {
      return;
    }
    dispatch(setKoloForceLogoutOnNextOpenAction(false));

    setTimeout(() => {
      setLogoutReinitStage(2);
      setEmailOverride(null);
      setWidgetUrl(null);
      setError(null);
      setWebViewKey(prev => prev + 1);
    }, 1000);
  }, [logoutReinitStage, dispatch]);

  const isLogoutInProgress = logoutReinitStage === 1;

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

        {!loading && error == null && Boolean(widgetUrl) && (
          <View style={[styles.webView, isLogoutInProgress && styles.webViewHidden]}>
            <WebView
              key={webViewKey}
              ref={webViewRef}
              source={{ uri: widgetUrl as string }}
              style={styles.webView}
              onNavigationStateChange={setNavState}
              setSupportMultipleWindows={false}
              allowsBackForwardNavigationGestures={true}
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
});
