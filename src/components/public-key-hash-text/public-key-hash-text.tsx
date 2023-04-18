import React, { FC, useCallback } from 'react';
import { Text, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { MarginProps } from 'src/interfaces/margin.props';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { getTruncatedProps } from 'src/utils/style.util';

import { usePublicKeyHashTextStyles } from './public-key-hash-text.styles';

interface Props extends MarginProps, TestIdProps {
  publicKeyHash: string;
  disabled?: boolean;
  longPress?: boolean;
  style?: ViewStyle;
}

export const PublicKeyHashText: FC<Props> = ({
  publicKeyHash,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  style,
  disabled = false,
  longPress = false,
  testID,
  testIDProperties
}) => {
  const styles = usePublicKeyHashTextStyles();
  const { trackEvent } = useAnalytics();

  const acceptPress = useCallback(() => {
    trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
    copyStringToClipboard(publicKeyHash);
  }, [trackEvent, testID, testIDProperties, publicKeyHash]);

  const handlePress = useCallback(() => !longPress && acceptPress(), [longPress, acceptPress]);
  const handleLongPress = useCallback(() => longPress && acceptPress(), [longPress, acceptPress]);

  return (
    <TouchableOpacity
      style={[styles.container, style, { marginTop, marginRight, marginBottom, marginLeft }]}
      disabled={disabled}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <Text {...getTruncatedProps(styles.publicKeyHashText, 'middle')} style={styles.publicKeyHashText}>
        {publicKeyHash}
      </Text>
    </TouchableOpacity>
  );
};
