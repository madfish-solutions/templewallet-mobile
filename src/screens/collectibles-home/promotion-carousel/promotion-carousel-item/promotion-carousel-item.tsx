import React, { FC, memo } from 'react';
import { Image, TouchableOpacity } from 'react-native';

import { openUrl } from '../../../../utils/linking.util';
import { PromotionCarouselItemInterface } from '../promotion-carousel.data';
import { usePromotionCarouselItemStyles } from './promotion-carousel-item.styles';

export const PromotionCarouselItem: FC<PromotionCarouselItemInterface> = memo(({ src, link }) => {
  const styles = usePromotionCarouselItemStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={() => openUrl(link)}>
      <Image style={styles.bannerImage} source={src} />
    </TouchableOpacity>
  );
});
