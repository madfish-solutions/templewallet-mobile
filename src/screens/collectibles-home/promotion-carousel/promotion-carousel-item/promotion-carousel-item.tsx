import React, { FC, memo } from 'react';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import { openUrl } from '../../../../utils/linking.util';
import { PromotionCarouselItemInterface } from '../promotion-carousel.data';
import { usePromotionCarouselItemStyles } from './promotion-carousel-item.styles';

export const PromotionCarouselItem: FC<PromotionCarouselItemInterface> = memo(({ source, link }) => {
  const styles = usePromotionCarouselItemStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={() => openUrl(link)}>
      <FastImage style={styles.bannerImage} source={source} />
    </TouchableOpacity>
  );
});
