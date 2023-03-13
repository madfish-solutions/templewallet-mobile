import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { skipPartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import {
  useIsPartnersPromoEnabledSelector,
  usePartnersPromoLoadingSelector,
  usePartnersPromoSelector,
  useSeenPartnersPromoIdsSelector
} from 'src/store/partners-promotion/partners-promotion-selectors';

import { PromotionItem } from '../promotion-item/promotion-item';
import { TextPromotionItem } from '../text-promotion-item/text-promotion-item';
import { OptimalPromotionVariantEnum } from './optimal-promotion-variant.enum';

interface Props extends TestIdProps {
  style?: StyleProp<ViewStyle>;
  shouldShowCloseButton?: boolean;
  variant?: OptimalPromotionVariantEnum;
}

export const OptimalPromotionItem: FC<Props> = ({
  testID,
  style,
  shouldShowCloseButton = true,
  variant = OptimalPromotionVariantEnum.Image
}) => {
  const dispatch = useDispatch();
  const partnersPromotion = usePartnersPromoSelector();
  const partnersPromotionLoading = usePartnersPromoLoadingSelector();
  const seenPromoIds = useSeenPartnersPromoIdsSelector();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();

  const handleClose = () => dispatch(skipPartnersPromotionAction(partnersPromotion.id));

  if (seenPromoIds.includes(partnersPromotion.id) || !partnersPromotionEnabled) {
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
        onClose={handleClose}
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
      onCloseButtonClick={handleClose}
    />
  );
};
