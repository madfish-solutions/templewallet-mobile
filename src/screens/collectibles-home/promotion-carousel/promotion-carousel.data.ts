import { Source } from 'react-native-fast-image';

import { madfishLink, quipuLink, supportUkraine, yupanaLink } from '../../../config/socials';

export interface PromotionCarouselItemInterface {
  source: Source;
  link: string;
}

export const promotionCarouselData: PromotionCarouselItemInterface[] = [
  {
    source: require('./banners/madfish.png'),
    link: madfishLink
  },
  {
    source: require('./banners/yupana.png'),
    link: yupanaLink
  },
  {
    source: require('./banners/quipu.png'),
    link: quipuLink
  },
  {
    source: require('./banners/ukraine.png'),
    link: supportUkraine
  }
];
