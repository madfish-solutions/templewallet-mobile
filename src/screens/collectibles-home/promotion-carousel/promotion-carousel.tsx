import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { Divider } from '../../../components/divider/divider';
import { useLayoutSizes } from '../../../hooks/use-layout-sizes.hook';
import { formatSize } from '../../../styles/format-size';
import { PromotionCarouselItem } from './promotion-carousel-item/promotion-carousel-item';
import { promotionCarouselData } from './promotion-carousel.data';
import { usePromotionCarouselStyles } from './promotion-carousel.styles';

export const PromotionCarousel = () => {
  const styles = usePromotionCarouselStyles();

  const { layoutWidth, handleLayout } = useLayoutSizes();
  const flooredLayoutWidth = useMemo(() => Math.floor(layoutWidth), [layoutWidth]);
  const itemWidth = useMemo(() => Math.floor(Math.abs(layoutWidth - 2 * formatSize(16))), [layoutWidth]);

  const [activeDotIndex, setActiveDotIndex] = useState(0);

  return (
    <View onLayout={handleLayout}>
      <Carousel
        data={promotionCarouselData}
        windowSize={flooredLayoutWidth}
        sliderWidth={flooredLayoutWidth}
        itemWidth={itemWidth}
        loop={true}
        autoplay={true}
        autoplayInterval={5000}
        renderItem={item => <PromotionCarouselItem {...item.item} />}
        onSnapToItem={index => setActiveDotIndex(index)}
      />
      <Divider />
      <Pagination
        dotsLength={4}
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
