import React, { FC, memo } from 'react';
import { Source } from 'react-native-fast-image';

import { PromotionItem } from 'src/components/promotion-item/promotion-item';

import { usePromotionCarouselItemStyles } from './promotion-carousel-item.styles';

interface Props {
  testID: string;
  source: Source | string;
  link: string;
  shouldShowAdBage?: boolean;
}

export const PromotionCarouselItem: FC<Props> = memo(props => {
  const styles = usePromotionCarouselItemStyles();

  return <PromotionItem style={styles.container} {...props} />;
});
