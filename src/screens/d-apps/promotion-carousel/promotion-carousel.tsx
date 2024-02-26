import { throttle } from 'lodash-es';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import type { ILayoutConfig } from 'react-native-reanimated-carousel/lib/typescript/layouts/parallax';
import type { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types';

import { PromotionItem } from 'src/components/promotion-item';
import { useInternalAdsAnalytics } from 'src/hooks/use-internal-ads-analytics.hook';
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
  const [promotionOffset, setPromotionOffset] = useState({ x: 0, y: 0 });
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);
  const partnersPromoShown = useIsPartnersPromoShown(PROMOTION_ID);
  const layoutRef = useRef<View>(null);
  const adRef = useRef<View>(null);
  const refs = useMemo(() => ({ parent: layoutRef, element: adRef }), [layoutRef, adRef]);
  const { onOutsideOfScrollAdLayout, onAdLoad } = useInternalAdsAnalytics('DApps', refs, promotionOffset, 500);

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
        <PromotionItem
          id={PROMOTION_ID}
          testID={PromotionCarouselSelectors.optimalPromotionBanner}
          shouldShowCloseButton={false}
          style={styles.promotionItem}
          shouldTryHypelabAd={false}
          ref={adRef}
          onError={() => setPromotionErrorOccurred(true)}
          onLoad={onAdLoad}
          onLayout={onOutsideOfScrollAdLayout}
        />
      );
    }

    return result;
  }, [activePromotion, onAdLoad, onOutsideOfScrollAdLayout, partnersPromoShown, promotionErrorOccurred, styles]);

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

  const handleProgressChange = useMemo(
    () =>
      throttle(
        (offsetProgress: number, absoluteProgress: number) => {
          let actualOffset = offsetProgress;
          if (absoluteProgress > 1) {
            const offsetPerSlide = Math.abs(offsetProgress / absoluteProgress);
            const totalLength = offsetPerSlide * data.length;
            const pivotX = totalLength / 2;
            if (offsetProgress > pivotX) {
              actualOffset = offsetProgress - totalLength;
            } else if (offsetProgress < -pivotX) {
              actualOffset = offsetProgress + totalLength;
            }
          }
          setPromotionOffset({ x: actualOffset, y: 0 });
        },
        100,
        { leading: false, trailing: true }
      ),
    [data.length]
  );

  const renderItem = useCallback((info: CarouselRenderItemInfo<JSX.Element>) => info.item, []);

  const style = useMemo(() => [styles.container, { height }], [styles.container, height]);

  return (
    <View onLayout={handleLayout} style={style} ref={layoutRef}>
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
          onProgressChange={handleProgressChange}
        />
      ) : null}
    </View>
  );
};
