import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useCallback } from 'react';
import { GestureResponderEvent } from 'react-native';

import { EmptyFn, EventFn } from 'src/config/general';
import { isAndroid } from 'src/config/system';
import { formatSize } from 'src/styles/format-size';
import { generateHitSlop } from 'src/styles/generate-hit-slop';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { Icon, IconProps } from '../icon';
import { TouchableIconStyles } from './touchable-icon.styles';

interface Props extends IconProps {
  disabled?: boolean;
  onPress: EmptyFn | EventFn<GestureResponderEvent>;
}

export const TouchableIcon: FC<Props> = ({ size = formatSize(24), name, color, style, disabled, testID, onPress }) => {
  const { trackEvent } = useAnalytics();

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      trackEvent(testID, AnalyticsEventCategory.ButtonPress);
      onPress(e);
    },
    [testID, onPress, trackEvent]
  );

  return (
    <TouchableOpacity
      style={[TouchableIconStyles.container, { width: size, height: size }, style]}
      disabled={disabled}
      hitSlop={generateHitSlop(formatSize(4))}
      {...(isAndroid && { disallowInterruption: true })}
      onPress={handlePress}
    >
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};
