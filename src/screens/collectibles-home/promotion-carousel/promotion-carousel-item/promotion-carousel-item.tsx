import React, { FC, memo } from 'react';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import { AnalyticsEventCategory } from '../../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../../utils/analytics/use-analytics.hook';
import { openUrl } from '../../../../utils/linking.util';
import { PromotionCarouselItemInterface } from '../promotion-carousel.data';
import { usePromotionCarouselItemStyles } from './promotion-carousel-item.styles';

export const PromotionCarouselItem: FC<PromotionCarouselItemInterface> = memo(({ testID, source, link }) => {
  const { trackEvent } = useAnalytics();

  const styles = usePromotionCarouselItemStyles();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        trackEvent(testID, AnalyticsEventCategory.General);
        openUrl(link);
      }}
    >
      <FastImage style={styles.bannerImage} source={source} />
    </TouchableOpacity>
  );
});
