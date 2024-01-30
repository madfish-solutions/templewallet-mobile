import React, { FC, useCallback, useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

// import { PromotionItem } from 'src/components/promotion-item/promotion-item';
import { EmptyFn } from 'src/config/general';
// import { usePromotionAfterConfirmation } from 'src/hooks/use-disable-promotion-after-confirmation.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import {
  useIsPartnersPromoEnabledSelector,
  // usePartnersPromoLoadingSelector,
  usePartnersPromoSelector
} from 'src/store/partners-promotion/partners-promotion-selectors';
import { AD_FRAME_URL, SMALL_PLACEMENT_SLUG } from 'src/utils/env.utils';
import { openUrl } from 'src/utils/linking';
import { useIsEmptyPromotion } from 'src/utils/optimal.utils';

// import { TextPromotionItem } from '../text-promotion-item/text-promotion-item';

import { OptimalPromotionVariantEnum } from './optimal-promotion-variant.enum';

interface Props extends TestIdProps {
  style?: StyleProp<ViewStyle>;
  shouldShowCloseButton?: boolean;
  variant?: OptimalPromotionVariantEnum;
  onImageError?: EmptyFn;
  onEmptyPromotionReceived?: EmptyFn;
}

export const OptimalPromotionItem: FC<Props> = ({
  testID,
  style,
  // shouldShowCloseButton = true,
  variant = OptimalPromotionVariantEnum.Image,
  // onImageError,
  onEmptyPromotionReceived
}) => {
  const partnersPromotion = usePartnersPromoSelector();
  // const partnersPromotionLoading = usePartnersPromoLoadingSelector();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  // const { disablePromotion } = usePromotionAfterConfirmation();

  const promotionIsEmpty = useIsEmptyPromotion(partnersPromotion);

  useEffect(() => {
    if (partnersPromotionEnabled && onEmptyPromotionReceived && promotionIsEmpty) {
      onEmptyPromotionReceived();
    }
  }, [partnersPromotionEnabled, onEmptyPromotionReceived, promotionIsEmpty]);

  const handleWebViewMessage = useCallback((event: WebViewMessageEvent) => {
    const { data: rawData } = event.nativeEvent;
    const data = JSON.parse(rawData);
    if (data.name === 'ad-click') {
      openUrl(data.url);
    }
  }, []);

  if (!partnersPromotionEnabled /* || promotionIsEmpty */) {
    return null;
  }

  if (variant === OptimalPromotionVariantEnum.Text) {
    return (
      <WebView
        testID={testID}
        source={{ uri: AD_FRAME_URL }}
        style={[{ width: '100%', aspectRatio: 320 / 112 }, style]}
        onMessage={handleWebViewMessage}
      />
    );

    /* return (
      <TextPromotionItem
        testID={testID}
        content={partnersPromotion?.copy?.content ?? 'fallback'}
        headline={partnersPromotion?.copy?.headline ?? 'fallback'}
        imageUri={partnersPromotion.image}
        link={partnersPromotion.link}
        loading={partnersPromotionLoading}
        shouldShowCloseButton={shouldShowCloseButton}
        style={style}
        onClose={disablePromotion}
        onImageError={onImageError}
      />
    ); */
  }

  return (
    <WebView
      testID={testID}
      source={{ uri: `${AD_FRAME_URL}/?w=320&h=50&p=${SMALL_PLACEMENT_SLUG}` }}
      style={[{ width: '100%', aspectRatio: 320 / 50 }, style]}
      onMessage={handleWebViewMessage}
    />
  );
  /* return (
    <PromotionItem
      testID={testID}
      source={{ uri: partnersPromotion.image }}
      link={partnersPromotion.link}
      loading={partnersPromotionLoading}
      shouldShowAdBage
      shouldShowCloseButton={shouldShowCloseButton}
      style={style}
      onCloseButtonClick={disablePromotion}
      onImageError={onImageError}
    />
  ); */
};
