import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { Divider } from '../../../components/divider/divider';
import { formatSize } from '../../../styles/format-size';
import { PromotionCarouselItem } from './promotion-carousel-item/promotion-carousel-item';
import { promotionCarouselData } from './promotion-carousel.data';
import { usePromotionCarouselStyles } from './promotion-carousel.styles';

const windowSize = Dimensions.get('screen').width;
const sliderWidth = windowSize - 2 * formatSize(16);

export const PromotionCarousel = () => {
  const styles = usePromotionCarouselStyles();

  const [activeDotIndex, setActiveDotIndex] = useState(0);

  return (
    <View>
      <Carousel
        data={promotionCarouselData}
        windowSize={windowSize}
        sliderWidth={windowSize}
        itemWidth={sliderWidth}
        loop={true}
        autoplay={true}
        renderItem={item => (
          <PromotionCarouselItem backgroundColor={item.item.backgroundColor} emojisArray={item.item.emojisArray} />
        )}
        onSnapToItem={index => setActiveDotIndex(index)}
      />
      <Divider />
      <Pagination
        dotsLength={promotionCarouselData.length}
        activeDotIndex={activeDotIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotStyle={styles.paginationInactiveDot}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    </View>
  );
};
