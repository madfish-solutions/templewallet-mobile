import React, { FC } from 'react';
import { ActivityIndicator, StyleProp, Text, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { skipPartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import {
  useIsPartnersPromoEnabledSelector,
  usePartnersPromoLoadingSelector,
  usePartnersPromoSelector,
  useSeenPartnersPromoIdsSelector
} from 'src/store/partners-promotion/partners-promotion-selectors';
import { formatSize } from 'src/styles/format-size';

import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { PromotionItem } from '../promotion-item/promotion-item';
import { useOptimalPromotionItemStyles } from './optimal-promotion-item.styles';
import { OptimalPromotionVariantEnum } from './optimal-promotion-variant.enum';

interface Props extends TestIdProps {
  style?: StyleProp<ViewStyle>;
  variant?: OptimalPromotionVariantEnum;
}

export const OptimalPromotionItem: FC<Props> = ({ testID, style, variant = OptimalPromotionVariantEnum.Image }) => {
  const dispatch = useDispatch();
  const partnersPromotion = usePartnersPromoSelector();
  const partnersPromotionLoading = usePartnersPromoLoadingSelector();
  const seenPromoIds = useSeenPartnersPromoIdsSelector();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  const styles = useOptimalPromotionItemStyles();

  const handleClose = () => dispatch(skipPartnersPromotionAction(partnersPromotion.id));

  if (seenPromoIds.includes(partnersPromotion.id) || !partnersPromotionEnabled) {
    return null;
  }

  if (variant === OptimalPromotionVariantEnum.Text) {
    return partnersPromotionLoading ? (
      <View style={[styles.loaderContainer, style]}>
        <ActivityIndicator />
      </View>
    ) : (
      <View style={[styles.container, style]}>
        <FastImage style={styles.image} source={{ uri: partnersPromotion.image }} resizeMode="contain" />
        <View style={styles.textsContainer}>
          <View style={styles.headline}>
            <Text style={styles.headlineText}>{partnersPromotion.copy.headline}</Text>
            <View style={styles.adLabel}>
              <Text style={styles.adLabelText}>AD</Text>
            </View>
          </View>
          <Text style={styles.content}>{partnersPromotion.copy.content}</Text>
        </View>
        <TouchableIcon name={IconNameEnum.X} onPress={handleClose} size={formatSize(16)} />
      </View>
    );
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
      onCloseButtonClick={handleClose}
    />
  );
};
