import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { usePromotionAfterConfirmation } from 'src/hooks/use-disable-promotion-after-confirmation.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import {
  useIsPartnersPromoEnabledSelector,
  usePartnersPromoLoadingSelector,
  usePartnersPromoSelector
} from 'src/store/partners-promotion/partners-promotion-selectors';
import { isEmptyPromotion } from 'src/utils/optimal.utils';

import { mockPartnersPromotion } from '../../store/partners-promotion/partners-promotion-state.mock';
import { PromotionItem } from '../promotion-item/promotion-item';
import { TextPromotionItem } from '../text-promotion-item/text-promotion-item';
import { OptimalPromotionVariantEnum } from './optimal-promotion-variant.enum';

interface Props extends TestIdProps {
  style?: StyleProp<ViewStyle>;
  shouldShowCloseButton?: boolean;
  variant?: OptimalPromotionVariantEnum;
  onImageError?: () => void;
  onEmptyPromotionReceived?: () => void;
}

export const OptimalPromotionItem: FC<Props> = ({
  testID,
  style,
  shouldShowCloseButton = true,
  variant = OptimalPromotionVariantEnum.Image,
  onImageError,
  onEmptyPromotionReceived
}) => {
  const partnersPromotion = usePartnersPromoSelector();
  const partnersPromotionLoading = usePartnersPromoLoadingSelector();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  const { disablePromotion } = usePromotionAfterConfirmation();

  if (!partnersPromotionEnabled) {
    return null;
  }

  if (
    isEmptyPromotion(partnersPromotion) ||
    JSON.stringify(mockPartnersPromotion) === JSON.stringify(partnersPromotion)
  ) {
    onEmptyPromotionReceived?.();

    return null;
  }

  if (variant === OptimalPromotionVariantEnum.Text) {
    return (
      <TextPromotionItem
        testID={testID}
        content={partnersPromotion.copy.content}
        headline={partnersPromotion.copy.headline}
        imageUri={partnersPromotion.image}
        link={partnersPromotion.link}
        loading={partnersPromotionLoading}
        shouldShowCloseButton={shouldShowCloseButton}
        style={style}
        onClose={disablePromotion}
        onImageError={onImageError}
      />
    );
  }

  return (
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
  );
};
