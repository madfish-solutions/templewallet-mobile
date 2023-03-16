import React, { FC, memo } from 'react';
import { ActivityIndicator, StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';

import { emptyFn } from 'src/config/general';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { openUrl } from 'src/utils/linking.util';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TextPromotionItemSelectors } from './text-promotion-item.selectors';
import { useTextPromotionItemStyles } from './text-promotion-item.styles';

interface Props extends TestIdProps {
  content: string;
  headline: string;
  imageUri: string;
  link: string;
  loading?: boolean;
  shouldShowCloseButton: boolean;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}

export const TextPromotionItem: FC<Props> = memo(
  ({ content, headline, imageUri, link, loading = false, shouldShowCloseButton, style, testID, onClose = emptyFn }) => {
    const { trackEvent } = useAnalytics();
    const colors = useColors();
    const styles = useTextPromotionItemStyles();

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
          <View style={[styles.loaderContainer, style]}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <FastImage style={styles.image} source={{ uri: imageUri }} resizeMode="contain" />
            <View style={styles.textsContainer}>
              <View style={styles.headline}>
                <Text style={styles.headlineText}>{headline}</Text>
                <View style={styles.adLabel}>
                  <Text style={styles.adLabelText}>AD</Text>
                </View>
              </View>
              <Text style={styles.content}>{content}</Text>
            </View>
            {shouldShowCloseButton && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  trackEvent(TextPromotionItemSelectors.closeButton, AnalyticsEventCategory.General);
                  onClose();
                }}
              >
                <Icon name={IconNameEnum.X} size={formatSize(16)} color={colors.peach} />
              </TouchableOpacity>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  }
);
