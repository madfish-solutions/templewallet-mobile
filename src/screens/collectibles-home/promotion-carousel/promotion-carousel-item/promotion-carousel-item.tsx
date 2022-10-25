import React, { FC, memo } from 'react';
import { TouchableOpacity } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';

import { AnalyticsEventCategory } from '../../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../../utils/analytics/use-analytics.hook';
import { openUrl } from '../../../../utils/linking.util';
import { usePromotionCarouselItemStyles } from './promotion-carousel-item.styles';

interface Props {
  testID: string;
  source: Source | string;
  link: string;
}

export const PromotionCarouselItem: FC<Props> = memo(({ testID, source, link }) => {
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
      {typeof source === 'string' ? (
        <SvgUri
          style={styles.bannerImage}
          uri={'https://generic-objects.fra1.digitaloceanspaces.com/banners/mobile-banner.svg'}
        />
      ) : (
        <FastImage style={styles.bannerImage} source={source} />
      )}
    </TouchableOpacity>
  );
});
