import React, { FC, memo } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';

import { formatSize } from '../../../../styles/format-size';
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
      <View style={styles.rewardContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>AD</Text>
        </View>
        {typeof source === 'string' ? (
          <SvgUri style={styles.bannerImage} height={formatSize(112)} width={formatSize(343)} uri={source} />
        ) : (
          <FastImage style={styles.bannerImage} source={source} />
        )}
      </View>
    </TouchableOpacity>
  );
});
