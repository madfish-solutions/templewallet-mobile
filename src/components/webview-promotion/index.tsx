import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { layoutScale } from 'src/config/styles';
import { AdFrameMessageType } from 'src/enums/ad-frame-message-type.enum';
import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
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
import { BackgroundAsset, ImagePromotionView } from '../image-promotion-view';
import { TouchableWithAnalytics } from '../touchable-with-analytics';

import { WebviewPromotionItemSelectors } from './selectors';
import { WebviewPromotionStyles } from './styles';

interface WebViewPromotionProps extends SingleProviderPromotionProps {
  provider: PromotionProviderEnum.HypeLab;
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
    onImpression,
    ...testIDProps
  }) => {
    const { testID, testIDProperties } = testIDProps;
    const isImageAd = variant === PromotionVariantEnum.Image;
    const colors = useColors();
    const theme = useThemeSelector();
    const { trackEvent, trackErrorEvent } = useAnalytics();
    const [adHref, setAdHref] = useState<string>();
    const [backgroundAsset, setBackgroundAsset] = useState<BackgroundAsset | undefined>();

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

      return { uri: `${HYPELAB_AD_FRAME_URL}/?${searchParams.toString()}` };
    }, [theme, initialSize, placementSlug, provider]);

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
              const { cta_url: ctaUrl, creative_set: creativeSet } = message.ad;
              setAdHref(ctaUrl);
              if (creativeSet && 'video' in creativeSet) {
                setBackgroundAsset({
                  type: 'video',
                  uri: creativeSet.video.url,
                  width: creativeSet.video.width,
                  height: creativeSet.video.height
                });
              } else if (creativeSet && 'image' in creativeSet) {
                setBackgroundAsset({
                  type: 'image',
                  uri: creativeSet.image.url,
                  width: creativeSet.image.width,
                  height: creativeSet.image.height
                });
              }
              if (adChanged(adHref, ctaUrl)) {
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
              break;
            case AdFrameMessageType.Impression:
              onImpression();
              break;
          }
        } catch (err) {
          console.error(err);
          trackErrorEvent('WebviewPromotionError', err, [], { eventData: e.nativeEvent.data });
        }
      },
      [adHref, onError, onReady, testID, testIDProperties, trackEvent, adChanged, onImpression, trackErrorEvent]
    );

    const webViewCommonProps = useMemo(
      () => ({
        allowsInlineMediaPlayback: true,
        source: adFrameSource,
        onError,
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
          backgroundAsset={backgroundAsset}
          {...testIDProps}
        >
          <View
            style={[
              WebviewPromotionStyles.imageAdFrameWrapper,
              { width: formatSize(size?.w ?? 320), height: formatSize(size?.h ?? 112) }
            ]}
            onLayout={handleContainerLayout}
          >
            {adFrameSource && (
              <WebView
                {...webViewCommonProps}
                containerStyle={WebviewPromotionStyles.imageAdFrame}
                style={WebviewPromotionStyles.webView}
              />
            )}
          </View>
        </ImagePromotionView>
      );
    }

    return (
      <View
        style={[WebviewPromotionStyles.textAdFrameContainer, !isVisible && WebviewPromotionStyles.invisible]}
        onLayout={handleContainerLayout}
      >
        {adFrameSource && size && (
          <WebView
            {...webViewCommonProps}
            containerStyle={[WebviewPromotionStyles.textAdFrame, { aspectRatio: size.w / size.h }]}
            style={WebviewPromotionStyles.webView}
          />
        )}
        {shouldShowCloseButton && (
          <TouchableWithAnalytics
            style={WebviewPromotionStyles.closeButton}
            onPress={onClose}
            testID={WebviewPromotionItemSelectors.closeButton}
          >
            <Icon name={IconNameEnum.X} size={formatSize(16)} color={colors.peach} />
          </TouchableWithAnalytics>
        )}
      </View>
    );
  }
);
