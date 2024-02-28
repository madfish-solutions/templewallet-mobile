import React, { FC, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ImagePromotionView } from 'src/components/image-promotion-view';
import { TextPromotionItemSelectors } from 'src/components/text-promotion-view/selectors';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
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

export const HypelabPromotion: FC<SingleProviderPromotionProps> = ({
  variant,
  isVisible,
  shouldShowCloseButton,
  onClose,
  onReady,
  onError,
  ...testIDProps
}) => {
  const { testID, testIDProperties } = testIDProps;
  const isImageAd = variant === PromotionVariantEnum.Image;
  const colors = useColors();
  const styles = useHypelabPromotionStyles();
  const theme = useThemeSelector();
  const { trackEvent } = useAnalytics();
  const [adFrameAspectRatio, setAdFrameAspectRatio] = useState(359 / 80);
  const [adHref, setAdHref] = useState<string>();
  const adFrameSource = useMemo(() => {
    const placementSlug = isImageAd ? HYPELAB_SMALL_PLACEMENT_SLUG : HYPELAB_NATIVE_PLACEMENT_SLUG;
    const origin = theme === ThemesEnum.dark ? 'mobile-dark' : 'mobile-light';
    const size = isImageAd ? { w: '320', h: '50' } : { w: '359', h: '80' };
    const searchParams = new URLSearchParams({
      p: placementSlug,
      o: origin,
      vw: formatSize(Number(size.w)).toString(),
      ...size
    });

    return { uri: `${HYPELAB_AD_FRAME_URL}/?${searchParams.toString()}` };
  }, [isImageAd, theme]);

  useTimeout(
    () => {
      if (!isString(adHref)) {
        onError();
      }
    },
    30000,
    [adHref, onError]
  );

  const handleAdFrameMessage = useCallback(
    (e: WebViewMessageEvent) => {
      try {
        const message: AdFrameMessage = JSON.parse(e.nativeEvent.data);

        switch (message.type) {
          case AdFrameMessageType.Resize:
            setAdFrameAspectRatio(message.width / message.height);
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
          <WebView
            source={adFrameSource}
            containerStyle={styles.imageAdFrame}
            onError={onError}
            onMessage={handleAdFrameMessage}
            webviewDebuggingEnabled={__DEV__}
            scrollEnabled={false}
            scalesPageToFit={false}
          />
        </View>
      </ImagePromotionView>
    );
  }

  return (
    <View style={[styles.textAdFrameContainer, !isVisible && styles.invisible]}>
      <WebView
        source={adFrameSource}
        containerStyle={styles.textAdFrame}
        style={[styles.textAdFrame, { aspectRatio: adFrameAspectRatio }]}
        onError={onError}
        onMessage={handleAdFrameMessage}
        webviewDebuggingEnabled={__DEV__}
        scrollEnabled={false}
        scalesPageToFit={false}
      />
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
};
