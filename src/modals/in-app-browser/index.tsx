import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollView, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';

import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { RefreshControl } from 'src/components/refresh-control/refresh-control';
import { isAndroid } from 'src/config/system';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { getUrlHostname } from 'src/utils/url.utils';

import { useInAppBrowserStyles } from './styles';

export const InAppBrowser: FC = () => {
  const { uri } = useRoute<RouteProp<ModalsParamList, ModalsEnum.InAppBrowser>>().params;

  usePageAnalytic(ModalsEnum.InAppBrowser);

  const [currentURL, setCurrentURL] = useState(uri);

  const styles = useInAppBrowserStyles();
  const { goBack } = useNavigation();

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
      webViewRef.current?.goBack();

      // prevent default behavior (exit app)
      return true;
    });

    return () => void backListener.remove();
  }, []);

  // PTR (pull-to-refresh)
  const [ptrEnabled, setPtrEnabled] = useState(true);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollViewContentContainer}
      scrollEnabled
      alwaysBounceVertical
      refreshControl={
        <RefreshControl refreshing={false} enabled={ptrEnabled} onRefresh={() => void webViewRef.current?.reload()} />
      }
    >
      <WebView
        ref={webViewRef}
        useWebView2={true}
        source={{ uri }}
        style={styles.webView}
        onNavigationStateChange={nav => void setCurrentURL(nav.url)}
        allowsBackForwardNavigationGestures={true}
        mediaPlaybackRequiresUserAction={true}
        pullToRefreshEnabled={false}
        bounces={false}
        onScroll={event => void setPtrEnabled(event.nativeEvent.contentOffset.y === 0)}
      />
    </ScrollView>
  );
};
