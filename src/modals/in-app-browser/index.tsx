/*
  Be mindful when tweaking rendering parameters here.
  App used to crash, as it woke up (from background) locked.
  Regarding solution, see:
  https://lonelycpp.github.io/react-native-youtube-iframe/navigation-crash/#2-tweak-webview-props
*/

import React, { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, BackHandler, NativeScrollEvent } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { RefreshControl } from 'src/components/refresh-control/refresh-control';
import { isAndroid } from 'src/config/system';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { getUrlHostname } from 'src/utils/url.utils';

import { useInAppBrowserStyles } from './styles';

export const InAppBrowser: FC = memo(() => {
  const { uri } = useModalParams<ModalsEnum.InAppBrowser>();
  const source = useMemo(() => ({ uri }), [uri]);

  usePageAnalytic(ModalsEnum.InAppBrowser);

  const [navState, setNavState] = useState<WebViewNavigation>();

  const styles = useInAppBrowserStyles();
  const { goBack } = useNavigation();

  const currentURL = navState?.url ?? uri;
  const canGoBack = navState?.canGoBack ?? false;

  useNavigationSetOptions(
    {
      headerLeft: () => <ExternalLinkButton url={currentURL} style={styles.externalBtn} onPress={goBack} />,
      headerTitle: () => <HeaderTitle title={getUrlHostname(currentURL) || 'In-App Browser'} />
    },
    [currentURL, styles, goBack]
  );

  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (!isAndroid) {
      return;
    }

    const backListener = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return `true` to prevent default behavior (app navigation/exit)

      if (canGoBack) {
        webViewRef.current?.goBack();

        return true;
      }

      return false;
    });

    return () => void backListener.remove();
  }, [canGoBack]);

  // PTR (pull-to-refresh)
  const [ptrEnabled, setPtrEnabled] = useState(true);

  const onScroll = useCallback(
    (event: { nativeEvent: Pick<NativeScrollEvent, 'contentOffset'> }) =>
      setPtrEnabled(event.nativeEvent.contentOffset.y === 0),
    []
  );

  const onRefresh = useCallback(() => void webViewRef.current?.reload(), []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.container}
      scrollEnabled
      alwaysBounceVertical
      refreshControl={<RefreshControl refreshing={false} enabled={ptrEnabled} onRefresh={onRefresh} />}
    >
      <WebView
        ref={webViewRef}
        source={source}
        style={styles.container}
        containerStyle={styles.container}
        onNavigationStateChange={setNavState}
        setSupportMultipleWindows={false}
        allowsBackForwardNavigationGestures={true}
        mediaPlaybackRequiresUserAction={true}
        pullToRefreshEnabled={false}
        bounces={false}
        overScrollMode="never"
        onScroll={onScroll}
      />
    </ScrollView>
  );
});
