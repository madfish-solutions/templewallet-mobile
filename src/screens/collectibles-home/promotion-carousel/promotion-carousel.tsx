import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { Divider } from '../../../components/divider/divider';
import { useLayoutSizes } from '../../../hooks/use-layout-sizes.hook';
import { useActivePromotionSelector } from '../../../store/advertising/advertising-selectors';
import { formatSize } from '../../../styles/format-size';
import { isDefined } from '../../../utils/is-defined';
import { PromotionCarouselItem } from './promotion-carousel-item/promotion-carousel-item';
import { COMMON_PROMOTION_CAROUSEL_DATA } from './promotion-carousel.data';
import { usePromotionCarouselStyles } from './promotion-carousel.styles';

export const PromotionCarousel = () => {
  const styles = usePromotionCarouselStyles();
  const activePromotion = useActivePromotionSelector();

  const data = useMemo<Array<JSX.Element>>(() => {
    if (isDefined(activePromotion.data)) {
      return [
        <PromotionCarouselItem
          link={activePromotion.data.url}
          source={activePromotion.data.mobileBannerUrl}
          testID={`PromotionCarousel/${activePromotion.data.name}`}
        />,
        ...COMMON_PROMOTION_CAROUSEL_DATA
      ];
    }

    return COMMON_PROMOTION_CAROUSEL_DATA;
  }, [activePromotion.data]);

  const { layoutWidth, handleLayout } = useLayoutSizes();
  const flooredLayoutWidth = useMemo(() => Math.floor(layoutWidth), [layoutWidth]);
  const itemWidth = useMemo(() => Math.floor(Math.abs(layoutWidth - 2 * formatSize(16))), [layoutWidth]);

  const [activeDotIndex, setActiveDotIndex] = useState(1);

  return (
    <View onLayout={handleLayout}>
      <Carousel
        data={data}
        sliderWidth={flooredLayoutWidth}
        itemWidth={itemWidth}
        enableMomentum={false}
        decelerationRate={0.5}
        removeClippedSubviews={true}
        loop={true}
        firstItem={-1}
        autoplay={true}
        autoplayInterval={5000}
        renderItem={renderItem => renderItem.item}
        onSnapToItem={index => setActiveDotIndex(index)}
      />
      <Divider />
      <Pagination
        dotsLength={data.length}
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
