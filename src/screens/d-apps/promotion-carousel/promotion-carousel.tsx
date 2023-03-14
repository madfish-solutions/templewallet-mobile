import React, { useMemo } from 'react';
import { View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { OptimalPromotionItem } from 'src/components/optimal-promotion-item/optimal-promotion-item';
import { useLayoutSizes } from 'src/hooks/use-layout-sizes.hook';
import { useActivePromotionSelector } from 'src/store/advertising/advertising-selectors';
import {
  useIsCurrentPromotionSkipped,
  useIsPartnersPromoEnabledSelector
} from 'src/store/partners-promotion/partners-promotion-selectors';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { PromotionCarouselItem } from './promotion-carousel-item/promotion-carousel-item';
import { COMMON_PROMOTION_CAROUSEL_DATA } from './promotion-carousel.data';
import { PromotionCarouselSelectors } from './promotion-carousel.selectors';
import { usePromotionCarouselStyles } from './promotion-carousel.styles';

export const PromotionCarousel = () => {
  const activePromotion = useActivePromotionSelector();
  const currentPromotionSkipped = useIsCurrentPromotionSkipped();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  const styles = usePromotionCarouselStyles();

  const data = useMemo<Array<JSX.Element>>(() => {
    const result = [...COMMON_PROMOTION_CAROUSEL_DATA];

    if (isDefined(activePromotion)) {
      result.unshift(
        <PromotionCarouselItem
          shouldShowAdBage
          link={activePromotion.url}
          source={activePromotion.mobileBannerUrl}
          testID={`PromotionCarousel/${activePromotion.name}`}
        />
      );
    }

    if (!currentPromotionSkipped && partnersPromotionEnabled) {
      result.unshift(
        <OptimalPromotionItem
          testID={PromotionCarouselSelectors.optimalPromotionBanner}
          shouldShowCloseButton={false}
          style={styles.promotionItem}
        />
      );
    }

    return result;
  }, [activePromotion, currentPromotionSkipped, partnersPromotionEnabled, styles]);

  const { layoutWidth, handleLayout } = useLayoutSizes();
  const flooredLayoutWidth = useMemo(() => Math.floor(layoutWidth), [layoutWidth]);

  return (
    <View onLayout={handleLayout} style={styles.container}>
      <Carousel
        data={data}
        loop={true}
        autoPlay={true}
        autoPlayInterval={3000}
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
