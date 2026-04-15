import React, { FC } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { ANIMATION_DURATION_FAST } from 'src/config/animation';
import { emptyFn } from 'src/config/general';
import { white } from 'src/config/styles';
import { useAnimationInterpolate } from 'src/hooks/use-animation-interpolate.hook';
import { useAnimationRef } from 'src/hooks/use-animation-ref.hook';
import { useUpdateAnimation } from 'src/hooks/use-update-animation.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { generateHitSlop } from 'src/styles/generate-hit-slop';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { useSwitchStyles } from './switch.styles';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const hapticFeedbackOptions = { enableVibrateFallback: false, ignoreAndroidSystemSettings: false };

interface Props extends TestIdProps {
  value: boolean;
  disabled?: boolean;
  onChange?: SyncFn<boolean>;
}

export const Switch: FC<Props> = ({ value, disabled = false, testID, testIDProperties, onChange = emptyFn }) => {
  const colors = useColors();
  const styles = useSwitchStyles();
  const animation = useAnimationRef(value);

  const { trackEvent } = useAnalytics();

  useUpdateAnimation(animation, value, { duration: ANIMATION_DURATION_FAST, useNativeDriver: false });

  const backgroundColor = useAnimationInterpolate(
    animation,
    {
      outputRange: disabled ? [colors.disabled, colors.disabled] : [colors.lines, colors.orange]
    },
    [colors, disabled]
  );

  const translateX = useAnimationInterpolate(animation, {
    outputRange: [0, formatSize(20)]
  });

  const toggleColor = disabled ? colors.lines : white;

  return (
    <AnimatedTouchableOpacity
      activeOpacity={1}
      disabled={disabled}
      style={[styles.touchableOpacity, { backgroundColor }]}
      hitSlop={generateHitSlop(formatSize(4))}
      onPress={e => {
        e.stopPropagation();
        trackEvent(testID, AnalyticsEventCategory.FormChange, testIDProperties);
        onChange(!value);
      }}
      onPressOut={() => ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions)}
    >
      <Animated.View style={[styles.toggle, { transform: [{ translateX }], backgroundColor: toggleColor }]} />
    </AnimatedTouchableOpacity>
  );
};
