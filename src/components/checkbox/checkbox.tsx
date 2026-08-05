import React, { memo, useCallback } from 'react';

import { emptyFn } from 'src/config/general';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { generateHitSlop } from 'src/styles/generate-hit-slop';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { setTestID } from 'src/utils/test-id.utils';

import { IconV2 } from '../icon-v2';
import { IconNameV2Enum } from '../icon-v2/icon-name.enum';
import { SafeTouchableOpacity } from '../safe-touchable-opacity';

import { CheckboxProps } from './checkbox.props';
import { CheckboxStyles } from './checkbox.styles';

export const Checkbox = memo<CheckboxProps>(
  ({ disabled = false, value, size = 24, children, onChange = emptyFn, testID }) => {
    const { trackEvent } = useAnalytics();
    const theme = useThemeSelector();

    const handlePress = useCallback(() => {
      trackEvent(testID, AnalyticsEventCategory.ButtonPress, { value: !value });
      onChange(!value);
    }, [value, testID, trackEvent, onChange]);

    return (
      <SafeTouchableOpacity
        disabled={disabled}
        style={CheckboxStyles.container}
        activeOpacity={1}
        hitSlop={generateHitSlop(formatSize(4))}
        onPress={handlePress}
        {...setTestID(testID)}
      >
        <IconV2
          name={
            value
              ? theme === ThemesEnum.dark
                ? IconNameV2Enum.CheckboxChecked
                : IconNameV2Enum.CheckboxCheckedFill
              : IconNameV2Enum.CheckboxEmpty
          }
          size={size}
        />
        {children}
      </SafeTouchableOpacity>
    );
  }
);
