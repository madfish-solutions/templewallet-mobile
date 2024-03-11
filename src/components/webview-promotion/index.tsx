import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { layoutScale } from 'src/config/styles';
import { AdFrameMessageType } from 'src/enums/ad-frame-message-type.enum';
import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { AdFrameMessage, SingleProviderPromotionProps } from 'src/types/promotion';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { HYPELAB_AD_FRAME_URL } from 'src/utils/env.utils';
import { useTimeout } from 'src/utils/hooks';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { openUrl } from 'src/utils/linking';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { ImagePromotionView } from '../image-promotion-view';
import { TextPromotionItemSelectors } from '../text-promotion-view/selectors';
import { TouchableWithAnalytics } from '../touchable-with-analytics';

import { useWebviewPromotionStyles } from './styles';

interface WebViewPromotionProps extends SingleProviderPromotionProps {
  provider: PromotionProviderEnum.HypeLab | PromotionProviderEnum.Persona;
  placementSlug: string;
  initialOriginalWidth?: number;
  initialOriginalHeight?: number;
  adChanged: (prevUrl: string | undefined, newUrl: string) => boolean;
}

export const WebViewPromotion = memo<WebViewPromotionProps>(
  ({
    variant,
    isVisible,
    shouldShowCloseButton,
    provider,
    initialOriginalWidth,
    initialOriginalHeight,
    placementSlug,
    adChanged,
    onClose,
    onReady,
    onError,
    ...testIDProps
  }) => {
    const { testID, testIDProperties } = testIDProps;
    const isImageAd = variant === PromotionVariantEnum.Image;
    const accountPkh = useCurrentAccountPkhSelector();
    const colors = useColors();
    const styles = useWebviewPromotionStyles();
    const theme = useThemeSelector();
    const { trackEvent } = useAnalytics();
    const [adHref, setAdHref] = useState<string>();

    const adHrefRef = useRef<string | undefined>(adHref);
    useEffect(() => void (adHrefRef.current = adHref), [adHref]);

    const [layoutRect, setLayoutRect] = useState<LayoutRectangle | undefined>();
    const initialSize = useMemo(() => {
      if (isDefined(initialOriginalWidth) && isDefined(initialOriginalHeight)) {
        return { w: initialOriginalWidth, h: initialOriginalHeight };
      }

      return layoutRect
        ? {
            w: initialOriginalWidth ?? Math.round(layoutRect.width / layoutScale),
            h: initialOriginalHeight ?? Math.round(layoutRect.height / layoutScale)
          }
        : undefined;
    }, [initialOriginalHeight, initialOriginalWidth, layoutRect]);
    const [size, setSize] = useState(initialSize);
    useEffect(() => void (initialSize && setSize(prevSize => prevSize ?? initialSize)), [initialSize]);

    const adFrameSource = useMemo(() => {
      const origin = theme === ThemesEnum.dark ? 'mobile-dark' : 'mobile-light';

      if (!initialSize) {
        return undefined;
      }

      const searchParams = new URLSearchParams({
        p: placementSlug,
        o: origin,
        vw: formatSize(Number(initialSize.w)).toString(),
        vh: formatSize(Number(initialSize.h)).toString(),
        w: initialSize.w.toString(),
        h: initialSize.h.toString(),
        ap: provider.toLowerCase()
      });
      if (provider === PromotionProviderEnum.Persona) {
        searchParams.set('a', accountPkh);
      }

      return { uri: `${HYPELAB_AD_FRAME_URL}/?${searchParams.toString()}` };
    }, [theme, initialSize, placementSlug, provider, accountPkh]);

    const handleContainerLayout = useCallback((e: LayoutChangeEvent) => {
      e.persist();
      setLayoutRect(e.nativeEvent.layout);
    }, []);

    useTimeout(() => void (!isString(adHrefRef.current) && onError()), 30000, [onError]);

    const handleAdFrameMessage = useCallback(
      (e: WebViewMessageEvent) => {
        try {
          const message: AdFrameMessage = JSON.parse(e.nativeEvent.data);

          switch (message.type) {
            case AdFrameMessageType.Resize:
              if (message.height !== 0 && message.width !== 0) {
                setSize({ w: Math.round(message.width / layoutScale), h: Math.round(message.height / layoutScale) });
              }
              break;
            case AdFrameMessageType.Ready:
              setAdHref(message.ad.cta_url);
              if (adChanged(adHref, message.ad.cta_url)) {
                onReady();
              }
              break;
            case AdFrameMessageType.Error:
              onError();
              break;
            case AdFrameMessageType.Click:
              if (isString(adHref)) {
                trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
                openUrl(adHref);
              }
          }
        } catch (err) {
          console.error(err);
        }
      },
      [adHref, onError, onReady, testID, testIDProperties, trackEvent, adChanged]
    );

    const webViewCommonProps = useMemo(
      () => ({
        source: adFrameSource,
        onError: onError,
        onMessage: handleAdFrameMessage,
        webviewDebuggingEnabled: __DEV__,
        scrollEnabled: false,
        scalesPageToFit: false,
        textZoom: 100
      }),
      [adFrameSource, handleAdFrameMessage, onError]
    );

    if (isImageAd) {
      return (
        <ImagePromotionView
          onClose={onClose}
          shouldShowCloseButton={shouldShowCloseButton}
          href={adHref ?? ''}
          isVisible={isVisible}
          shouldShowAdBage
          {...testIDProps}
        >
          <View
            style={[
              styles.imageAdFrameWrapper,
              { width: formatSize(size?.w ?? 320), height: formatSize(size?.h ?? 112) }
            ]}
            onLayout={handleContainerLayout}
          >
            {adFrameSource && (
              <WebView {...webViewCommonProps} containerStyle={styles.imageAdFrame} style={styles.webView} />
            )}
          </View>
        </ImagePromotionView>
      );
    }

    return (
      <View style={[styles.textAdFrameContainer, !isVisible && styles.invisible]} onLayout={handleContainerLayout}>
        {adFrameSource && size && (
          <WebView
            {...webViewCommonProps}
            containerStyle={[styles.textAdFrame, { aspectRatio: size.w / size.h }]}
            style={styles.webView}
          />
        )}
        {shouldShowCloseButton && (
          <TouchableWithAnalytics
            style={styles.closeButton}
            onPress={onClose}
            testID={TextPromotionItemSelectors.closeButton}
          >
            <Icon name={IconNameEnum.X} size={formatSize(16)} color={colors.peach} />
          </TouchableWithAnalytics>
        )}
      </View>
    );
  }
);
