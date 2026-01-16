import React, { ReactElement, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import type { ILayoutConfig } from 'react-native-reanimated-carousel/lib/typescript/layouts/parallax';
import type { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types';

import { useInternalAdsAnalytics } from 'src/hooks/use-internal-ads-analytics.hook';
import { useLayoutSizes } from 'src/hooks/use-layout-sizes.hook';
import { useActivePromotionSelector } from 'src/store/advertising/advertising-selectors';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { PromotionCarouselItem } from './promotion-carousel-item/promotion-carousel-item';
import { COMMON_PROMOTION_CAROUSEL_DATA } from './promotion-carousel.data';
import { usePromotionCarouselStyles } from './promotion-carousel.styles';

export const PromotionCarousel = () => {
  const activePromotion = useActivePromotionSelector();
  const styles = usePromotionCarouselStyles();
  const adPageName = 'DApps';
  const { onAdLoad, onIsVisible } = useInternalAdsAnalytics(adPageName, undefined, true, 500);

  const data = useMemo<Array<ReactElement>>(() => {
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

    return result;
  }, [activePromotion, onAdLoad, styles]);

  const handleSnapToItem = useCallback((index: number) => onIsVisible(index === 0), [onIsVisible]);

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

  const renderItem = useCallback((info: CarouselRenderItemInfo<ReactElement>) => info.item, []);

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
          onSnapToItem={handleSnapToItem}
        />
      ) : null}
    </View>
  );
};
