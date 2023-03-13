import React, { FC, memo } from 'react';
import { TouchableOpacity, Text, View, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { useColors } from 'src/styles/use-colors';

import { formatSize } from '../../styles/format-size';
import { AnalyticsEventCategory } from '../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../utils/analytics/use-analytics.hook';
import { openUrl } from '../../utils/linking.util';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { PromotionItemSelectors } from './promotion-item.selectors';
import { usePromotionItemStyles } from './promotion-item.styles';

interface Props extends TestIdProps {
  source: Source | string;
  link: string;
  loading?: boolean;
  shouldShowAdBage?: boolean;
  shouldShowCloseButton?: boolean;
  style?: StyleProp<ViewStyle>;
  onCloseButtonClick?: () => void;
}

export const PromotionItem: FC<Props> = memo(
  ({
    testID,
    source,
    link,
    loading = false,
    shouldShowAdBage = false,
    shouldShowCloseButton = false,
    style,
    onCloseButtonClick
  }) => {
    const { trackEvent } = useAnalytics();

    const colors = useColors();
    const styles = usePromotionItemStyles();

    return (
      <TouchableOpacity
        testID={testID}
        style={[styles.container, style]}
        onPress={() => {
          trackEvent(testID, AnalyticsEventCategory.General);
          openUrl(link);
        }}
      >
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.rewardContainer}>
            {shouldShowAdBage && (
              <View style={styles.textContainer}>
                <Text style={styles.text}>AD</Text>
              </View>
            )}
            {shouldShowCloseButton && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  trackEvent(PromotionItemSelectors.closeButton, AnalyticsEventCategory.General);
                  onCloseButtonClick?.();
                }}
              >
                <Icon name={IconNameEnum.XBold} size={formatSize(9.43)} color={colors.peach} />
              </TouchableOpacity>
            )}
            {typeof source === 'string' ? (
              <SvgUri style={styles.bannerImage} height={formatSize(112)} width={formatSize(343)} uri={source} />
            ) : (
              <FastImage style={styles.bannerImage} source={source} />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }
);
