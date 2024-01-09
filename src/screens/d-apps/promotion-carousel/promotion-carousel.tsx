import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import type { ILayoutConfig } from 'react-native-reanimated-carousel/lib/typescript/layouts/parallax';
import type { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types';

import { OptimalPromotionItem } from 'src/components/optimal-promotion-item/optimal-promotion-item';
import { useLayoutSizes } from 'src/hooks/use-layout-sizes.hook';
import { useIsPartnersPromoShown, usePartnersPromoLoad } from 'src/hooks/use-partners-promo';
import { useActivePromotionSelector } from 'src/store/advertising/advertising-selectors';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { PromotionCarouselItem } from './promotion-carousel-item/promotion-carousel-item';
import { COMMON_PROMOTION_CAROUSEL_DATA } from './promotion-carousel.data';
import { PromotionCarouselSelectors } from './promotion-carousel.selectors';
import { usePromotionCarouselStyles } from './promotion-carousel.styles';

const PROMOTION_ID = 'carousel-promotion';

export const PromotionCarousel = () => {
  const activePromotion = useActivePromotionSelector();
  const styles = usePromotionCarouselStyles();
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);
  const partnersPromoShown = useIsPartnersPromoShown(PROMOTION_ID);

  usePartnersPromoLoad(PROMOTION_ID);

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

    if (partnersPromoShown && !promotionErrorOccurred) {
      result.unshift(
        <OptimalPromotionItem
          id={PROMOTION_ID}
          testID={PromotionCarouselSelectors.optimalPromotionBanner}
          shouldShowCloseButton={false}
          style={styles.promotionItem}
          onImageError={() => setPromotionErrorOccurred(true)}
          onEmptyPromotionReceived={() => setPromotionErrorOccurred(true)}
        />
      );
    }

    return result;
  }, [activePromotion, partnersPromoShown, promotionErrorOccurred, styles]);

  const height = formatSize(112);
  const { layoutWidth, handleLayout } = useLayoutSizes();
  const flooredWidth = useMemo(() => Math.floor(layoutWidth), [layoutWidth]);

  const modeConfig = useMemo<ILayoutConfig>(
    () => ({
      parallaxScrollingOffset: 24,
      parallaxScrollingScale: 1,
      parallaxAdjacentItemScale: 1
    }),
    []
  );

  const renderItem = useCallback((info: CarouselRenderItemInfo<JSX.Element>) => info.item, []);

  const style = useMemo(() => [styles.container, { height }], [styles.container, height]);

  return (
    <View onLayout={handleLayout} style={style}>
      {flooredWidth > 0 ? (
        <Carousel
          data={data}
          loop={true}
          autoPlay={true}
          autoPlayInterval={3000}
          mode="parallax"
          modeConfig={modeConfig}
          width={flooredWidth}
          height={height}
          scrollAnimationDuration={1200}
          renderItem={renderItem}
        />
      ) : null}
    </View>
  );
};
