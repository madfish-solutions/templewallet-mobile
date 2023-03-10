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

interface Props extends TestIdProps {
  style?: StyleProp<ViewStyle>;
}

export const OptimalPromotionItem: FC<Props> = ({ testID, style }) => {
  const dispatch = useDispatch();
  const partnersPromotion = usePartnersPromoSelector();
  const partnersPromotionLoading = usePartnersPromoLoadingSelector();
  const seenPromoIds = useSeenPartnersPromoIdsSelector();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();

  if (seenPromoIds.includes(partnersPromotion.id) || !partnersPromotionEnabled) {
    return null;
  }

  return (
    <PromotionItem
      testID={testID}
      source={{ uri: partnersPromotion.image }}
      link={partnersPromotion.link}
      loading={partnersPromotionLoading}
      shouldShowAdBage
      shouldShowCloseButton
      style={style}
      onCloseButtonClick={() => dispatch(skipPartnersPromotionAction(partnersPromotion.id))}
    />
  );
};
