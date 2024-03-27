import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ImagePromotionView } from 'src/components/image-promotion-view';
import { TextPromotionItemSelectors } from 'src/components/text-promotion-view/selectors';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { layoutScale } from 'src/config/styles';
import { AdFrameMessageType } from 'src/enums/ad-frame-message-type.enum';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { AdFrameMessage, SingleProviderPromotionProps } from 'src/types/promotion';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { HYPELAB_AD_FRAME_URL, HYPELAB_NATIVE_PLACEMENT_SLUG, HYPELAB_SMALL_PLACEMENT_SLUG } from 'src/utils/env.utils';
import { useTimeout } from 'src/utils/hooks';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { openUrl } from 'src/utils/linking';

import { useHypelabPromotionStyles } from './styles';

const AD_CONTENT_RELATED_URL_SEARCH_PARAMS = ['campaign_slug', 'creative_set_slug', 'placement_slug'];

export const HypelabPromotion = memo<SingleProviderPromotionProps>(
  ({ variant, isVisible, shouldShowCloseButton, onClose, onReady, onError, ...testIDProps }) => {
    const { testID, testIDProperties } = testIDProps;
    const isImageAd = variant === PromotionVariantEnum.Image;
    const colors = useColors();
    const styles = useHypelabPromotionStyles();
    const theme = useThemeSelector();
    const { trackEvent } = useAnalytics();
    const [adHref, setAdHref] = useState<string>();
    const adHrefRef = useRef(adHref);

    useEffect(() => void (adHrefRef.current = adHref), [adHref]);

    const [layoutRect, setLayoutRect] = useState<LayoutRectangle | undefined>();
    const initialSize = useMemo(() => {
      if (isImageAd) {
        return { w: 320, h: 50 };
      }

      return layoutRect ? { w: Math.round(layoutRect.width / layoutScale), h: 80 } : undefined;
    }, [isImageAd, layoutRect]);
    const [size, setSize] = useState(initialSize);
    useEffect(() => void (initialSize && setSize(prevSize => prevSize ?? initialSize)), [initialSize]);

    const adFrameSource = useMemo(() => {
      const placementSlug = isImageAd ? HYPELAB_SMALL_PLACEMENT_SLUG : HYPELAB_NATIVE_PLACEMENT_SLUG;
      const origin = theme === ThemesEnum.dark ? 'mobile-dark' : 'mobile-light';

      if (!initialSize) {
        return undefined;
      }

      const searchParams = new URLSearchParams({
        p: placementSlug,
        o: origin,
        vw: formatSize(Number(initialSize.w)).toString(),
        w: Number(initialSize.w).toString(),
        h: Number(initialSize.h).toString()
      });

      return { uri: `${HYPELAB_AD_FRAME_URL}/?${searchParams.toString()}` };
    }, [isImageAd, initialSize, theme]);

    const handleMainLayout = useCallback((e: LayoutChangeEvent) => {
      e.persist();
      setLayoutRect(e.nativeEvent.layout);
    }, []);

    useTimeout(
      () => {
        if (!isString(adHrefRef.current)) {
          onError();
        }
      },
      30000,
      [onError]
    );

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
              const prevAdHrefSearchParams = isDefined(adHref) ? new URL(adHref).searchParams : new URLSearchParams();
              const newAdHrefSearchParams = new URL(message.ad.cta_url).searchParams;
              setAdHref(message.ad.cta_url);
              if (
                AD_CONTENT_RELATED_URL_SEARCH_PARAMS.some(
                  paramName => prevAdHrefSearchParams.get(paramName) !== newAdHrefSearchParams.get(paramName)
                )
              ) {
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
      [adHref, onError, onReady, testID, testIDProperties, trackEvent]
    );

    const webViewCommonProps = {
      allowsInlineMediaPlayback: true,
      source: adFrameSource,
      onError: onError,
      onMessage: handleAdFrameMessage,
      webviewDebuggingEnabled: __DEV__,
      scrollEnabled: false,
      scalesPageToFit: false,
      textZoom: 100
    };

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
          <View style={styles.imageAdFrameWrapper}>
            <WebView {...webViewCommonProps} containerStyle={styles.imageAdFrame} style={styles.webView} />
          </View>
        </ImagePromotionView>
      );
    }

    return (
      <View style={[styles.textAdFrameContainer, !isVisible && styles.invisible]} onLayout={handleMainLayout}>
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
