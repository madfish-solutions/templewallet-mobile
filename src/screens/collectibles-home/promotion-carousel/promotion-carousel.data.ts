import { Source } from 'react-native-fast-image';

import { madfishLink, quipuLink, supportUkraine, yupanaLink } from '../../../config/socials';
import { PromotionCarouselSelectors } from './promotion-carousel.selectors';

export interface PromotionCarouselItemInterface {
  testID: string;
  source: Source;
  link: string;
}

export const promotionCarouselData: PromotionCarouselItemInterface[] = [
  {
    testID: PromotionCarouselSelectors.MadFishBlog,
    source: require('./banners/madfish.png'),
    link: madfishLink
  },
  {
    testID: PromotionCarouselSelectors.Yupana,
    source: require('./banners/yupana.png'),
    link: yupanaLink
  },
  {
    testID: PromotionCarouselSelectors.QuipuSwap,
    source: require('./banners/quipu.png'),
    link: quipuLink
  },
  {
    testID: PromotionCarouselSelectors.SupportUkraine,
    source: require('./banners/ukraine.png'),
    link: supportUkraine
  }
];
