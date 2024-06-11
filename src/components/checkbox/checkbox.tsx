import React, { memo, useCallback } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Path, Rect, Svg } from 'react-native-svg';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { emptyFn } from 'src/config/general';
import { formatSize } from 'src/styles/format-size';
import { generateHitSlop } from 'src/styles/generate-hit-slop';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { setTestID } from 'src/utils/test-id.utils';

import { CheckboxProps } from './checkbox.props';
import { CheckboxStyles } from './checkbox.styles';

export const Checkbox = memo<CheckboxProps>(
  ({
    disabled = false,
    inverted = false,
    value,
    size = formatSize(24),
    strokeWidth = formatSize(1.5),
    children,
    onChange = emptyFn,
    testID
  }) => {
    const colors = useColors();
    const { trackEvent } = useAnalytics();

    const handlePress = useCallback(() => {
      trackEvent(testID, AnalyticsEventCategory.ButtonPress, { value: !value });
      onChange(!value);
    }, [value, testID, trackEvent, onChange]);

    return (
      <TouchableOpacity
        disabled={disabled}
        style={CheckboxStyles.container}
        activeOpacity={1}
        hitSlop={generateHitSlop(formatSize(4))}
        onPress={handlePress}
        {...setTestID(testID)}
      >
        {inverted ? (
          <Icon size={size} name={value ? IconNameEnum.InvertedCheckboxOn : IconNameEnum.InvertedCheckboxOff} />
        ) : (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect
              x="2.75"
              y="2.75"
              width="18.5"
              height="18.5"
              rx="2.25"
              stroke={disabled ? colors.gray1 : colors.orange}
              strokeWidth={strokeWidth}
            />
            {value && (
              <Path
                d="M7 12.75L10 15.75L17.5 8"
                stroke={colors.orange}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </Svg>
        )}
        {children}
      </TouchableOpacity>
    );
  }
);
