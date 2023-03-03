import React from 'react';

import { madfishLink, quipuLink, supportUkraine, yupanaLink } from '../../../config/socials';
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
    link={yupanaLink}
    source={require('./banners/yupana.png')}
    testID={PromotionCarouselSelectors.yupanaBanner}
  />,
  <PromotionCarouselItem
    link={quipuLink}
    source={require('./banners/quipu.png')}
    testID={PromotionCarouselSelectors.quipuSwapBanner}
  />
];
