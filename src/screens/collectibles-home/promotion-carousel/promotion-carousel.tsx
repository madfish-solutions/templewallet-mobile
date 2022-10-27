import React, { useMemo } from 'react';
import { View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { useLayoutSizes } from '../../../hooks/use-layout-sizes.hook';
import { useActivePromotionSelector } from '../../../store/advertising/advertising-selectors';
import { formatSize } from '../../../styles/format-size';
import { isDefined } from '../../../utils/is-defined';
import { PromotionCarouselItem } from './promotion-carousel-item/promotion-carousel-item';
import { COMMON_PROMOTION_CAROUSEL_DATA } from './promotion-carousel.data';

export const PromotionCarousel = () => {
  const activePromotion = useActivePromotionSelector();

  const data = useMemo<Array<JSX.Element>>(() => {
    if (isDefined(activePromotion)) {
      return [
        <PromotionCarouselItem
          link={activePromotion.url}
          source={activePromotion.mobileBannerUrl}
          testID={`PromotionCarousel/${activePromotion.name}`}
        />,
        ...COMMON_PROMOTION_CAROUSEL_DATA
      ];
    }

    return COMMON_PROMOTION_CAROUSEL_DATA;
  }, [activePromotion]);

  const { layoutWidth, handleLayout } = useLayoutSizes();
  const flooredLayoutWidth = useMemo(() => Math.floor(layoutWidth), [layoutWidth]);

  return (
    <View onLayout={handleLayout}>
      <Carousel
        data={data}
        loop={true}
        autoPlay={true}
        autoPlayInterval={2000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingOffset: 24,
          parallaxScrollingScale: 1,
          parallaxAdjacentItemScale: 1
        }}
        width={flooredLayoutWidth}
        height={formatSize(112)}
        scrollAnimationDuration={1200}
        renderItem={renderItem => renderItem.item}
      />
    </View>
  );
};
