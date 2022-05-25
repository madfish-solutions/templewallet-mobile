import { ImageSourcePropType } from 'react-native';

import { madfishLink, quipuLink, supportUkraine, yupanaLink } from '../../../config/socials';

export interface PromotionCarouselItemInterface {
  src: ImageSourcePropType;
  link: string;
}

export const promotionCarouselData: PromotionCarouselItemInterface[] = [
  {
    src: require('./banners/yupana.png'),
    link: yupanaLink
  },
  {
    src: require('./banners/ukraine.png'),
    link: supportUkraine
  },
  {
    src: require('./banners/quipu.png'),
    link: quipuLink
  },
  {
    src: require('./banners/madfish.png'),
    link: madfishLink
  }
];
