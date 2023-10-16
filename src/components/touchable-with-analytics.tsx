import React, { ComponentType, FC, useCallback } from 'react';
import { GestureResponderEvent, TouchableOpacityProps, TouchableOpacity as RNTouchableOpacity } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

/** @deprecated */
export type OriginalTouchableOpacityComponentType = ComponentType<TouchableOpacityProps>;

interface Props extends TouchableOpacityProps, TestIdProps {
  Component?: OriginalTouchableOpacityComponentType;
  shouldTrackShortPress?: boolean;
  shouldTrackLongPress?: boolean;
}

export const TouchableWithAnalytics: FC<Props> = ({
  testID,
  testIDProperties,
  shouldTrackLongPress = false,
  shouldTrackShortPress = true,
  onPress,
  onLongPress,
  Component = RNTouchableOpacity,
  ...restProps
}) => {
  const { trackEvent } = useAnalytics();

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (shouldTrackShortPress) {
        trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
      }
      onPress?.(event);
    },
    [onPress, testID, testIDProperties, trackEvent, shouldTrackShortPress]
  );

  const handleLongPress = useCallback(
    (event: GestureResponderEvent) => {
      if (shouldTrackLongPress) {
        trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
      }
      onLongPress?.(event);
    },
    [onLongPress, testID, testIDProperties, trackEvent, shouldTrackLongPress]
  );

  return <Component {...restProps} onPress={handlePress} onLongPress={handleLongPress} testID={testID} />;
};
