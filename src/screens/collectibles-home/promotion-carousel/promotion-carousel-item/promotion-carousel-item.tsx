import React, { FC } from 'react';
import { Image, Text, View } from 'react-native';

import { formatSize } from '../../../../styles/format-size';
import { PromotionCarouselItemInterface } from '../promotion-carousel.data';
import { usePromotionCarouselItemStyles } from './promotion-carousel-item.styles';

const width = formatSize(64);
const height = formatSize(64);

export const PromotionCarouselItem: FC<PromotionCarouselItemInterface> = ({ backgroundColor, emojisArray }) => {
  const styles = usePromotionCarouselItemStyles();

  return (
    <View style={[styles.root, { backgroundColor }]}>
      <View style={styles.emojisContainer}>
        {emojisArray.map(uri => (
          <Image key={uri} source={{ uri, width, height }} />
        ))}
      </View>
      <Text style={styles.text}>Promote your shit here for 1 TEZ/Day</Text>
    </View>
  );
};
