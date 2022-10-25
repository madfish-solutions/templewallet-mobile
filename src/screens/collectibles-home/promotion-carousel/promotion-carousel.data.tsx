import React from 'react';

import { madfishLink, quipuLink, supportUkraine, yupanaLink } from '../../../config/socials';
import { PromotionCarouselItem } from './promotion-carousel-item/promotion-carousel-item';
import { PromotionCarouselSelectors } from './promotion-carousel.selectors';

export const COMMON_PROMOTION_CAROUSEL_DATA = [
  <PromotionCarouselItem
    link={madfishLink}
    source={require('./banners/madfish.png')}
    testID={PromotionCarouselSelectors.MadFishBlog}
  />,
  <PromotionCarouselItem
    link={yupanaLink}
    source={require('./banners/yupana.png')}
    testID={PromotionCarouselSelectors.Yupana}
  />,
  <PromotionCarouselItem
    link={quipuLink}
    source={require('./banners/quipu.png')}
    testID={PromotionCarouselSelectors.QuipuSwap}
  />,
  <PromotionCarouselItem
    link={supportUkraine}
    source={require('./banners/ukraine.png')}
    testID={PromotionCarouselSelectors.SupportUkraine}
  />
];
