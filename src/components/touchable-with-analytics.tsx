import React, { ComponentType, FC, useCallback } from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

type GHTouchableOpacityProps = typeof GHTouchableOpacity extends ComponentType<infer P> ? P : never;

/** Taking `GHTouchableOpacityProps`, as a narrower type of the two */
export type TouchableOpacityComponentProps = GHTouchableOpacityProps;

interface Props extends TouchableOpacityComponentProps, TestIdProps {
  Component?: typeof RNTouchableOpacity | typeof GHTouchableOpacity;
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

  const handlePress = useCallback(() => {
    if (shouldTrackShortPress) {
      trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
    }
    onPress?.();
  }, [onPress, testID, testIDProperties, trackEvent, shouldTrackShortPress]);

  const handleLongPress = useCallback(() => {
    if (shouldTrackLongPress) {
      trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
    }
    onLongPress?.();
  }, [onLongPress, testID, testIDProperties, trackEvent, shouldTrackLongPress]);

  return <Component {...restProps} onPress={handlePress} onLongPress={handleLongPress} testID={testID} />;
};
