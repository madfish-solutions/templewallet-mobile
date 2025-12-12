import React from 'react';

import { madfishLink, quipuLink, supportUkraine } from 'src/config/socials';

import { PromotionCarouselItem } from './promotion-carousel-item/promotion-carousel-item';
import { PromotionCarouselSelectors } from './promotion-carousel.selectors';

export const COMMON_PROMOTION_CAROUSEL_DATA = [
  <PromotionCarouselItem
    link={supportUkraine}
    source={require('./banners/ukraine.png')}
    testID={PromotionCarouselSelectors.supportUkraineBanner}
  />,
  <PromotionCarouselItem
    link={madfishLink}
    source={require('./banners/madfish.png')}
    testID={PromotionCarouselSelectors.madFishBlogBanner}
  />,
  <PromotionCarouselItem
    link={quipuLink}
    source={require('./banners/quipu.png')}
    testID={PromotionCarouselSelectors.quipuSwapBanner}
  />
];
