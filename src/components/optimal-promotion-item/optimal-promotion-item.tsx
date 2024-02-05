import React, { FC, useCallback, useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { TestIdProps } from 'src/interfaces/test-id.props';
import {
  useIsPartnersPromoEnabledSelector,
  usePartnersPromoSelector
} from 'src/store/partners-promotion/partners-promotion-selectors';
import { useIsEmptyPromotion } from 'src/utils/optimal.utils';

import { openUrl } from '../../utils/linking';

import { OptimalPromotionVariantEnum } from './optimal-promotion-variant.enum';

interface Props extends TestIdProps {
  style?: StyleProp<ViewStyle>;
  shouldShowCloseButton?: boolean;
  variant?: OptimalPromotionVariantEnum;
  onImageError?: EmptyFn;
  onEmptyPromotionReceived?: EmptyFn;
}

const AD_FRAME_URL = 'http://localhost:3000/ads';

export const OptimalPromotionItem: FC<Props> = ({
  testID,
  style,
  //shouldShowCloseButton = true,
  variant = OptimalPromotionVariantEnum.Image,
  //onImageError,
  onEmptyPromotionReceived
}) => {
  const partnersPromotion = usePartnersPromoSelector();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();

  const promotionIsEmpty = useIsEmptyPromotion(partnersPromotion);

  const handleWebViewMessage = useCallback((event: WebViewMessageEvent) => {
    const { data: rawData } = event.nativeEvent;
    const data = JSON.parse(rawData);
    if (data.name === 'ad-click') {
      openUrl(data.url);
    }
  }, []);

  useEffect(() => {
    if (partnersPromotionEnabled && onEmptyPromotionReceived && promotionIsEmpty) {
      onEmptyPromotionReceived();
    }
  }, [partnersPromotionEnabled, onEmptyPromotionReceived, promotionIsEmpty]);

  if (!partnersPromotionEnabled) {
    return null;
  }

  if (variant === OptimalPromotionVariantEnum.Text) {
    return (
      <WebView
        testID={testID}
        source={{ uri: AD_FRAME_URL }}
        style={[{ width: '100%', aspectRatio: 320 / 70 }, style]}
        onMessage={handleWebViewMessage}
      />
    );
  }

  return (
    <WebView
      testID={testID}
      source={{ uri: AD_FRAME_URL }}
      style={[{ width: '100%', aspectRatio: 320 / 70 }, style]}
      onMessage={handleWebViewMessage}
    />
  );
};
