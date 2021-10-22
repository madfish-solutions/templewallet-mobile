import React, { FC } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { ANIMATION_DURATION_FAST } from '../../config/animation';
import { emptyFn, EventFn } from '../../config/general';
import { white } from '../../config/styles';
import { useAnimationInterpolate } from '../../hooks/use-animation-interpolate.hook';
import { useAnimationRef } from '../../hooks/use-animation-ref.hook';
import { useUpdateAnimation } from '../../hooks/use-update-animation.hook';
import { formatSize } from '../../styles/format-size';
import { generateHitSlop } from '../../styles/generate-hit-slop';
import { useColors } from '../../styles/use-colors';
import { useSwitchStyles } from './switch.styles';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const hapticFeedbackOptions = { enableVibrateFallback: false, ignoreAndroidSystemSettings: false };

interface Props {
  value: boolean;
  disabled?: boolean;
  onChange?: EventFn<boolean>;
}

export const Switch: FC<Props> = ({ value, disabled = false, onChange = emptyFn }) => {
  const colors = useColors();
  const styles = useSwitchStyles();
  const animation = useAnimationRef(value);

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
        onChange(!value);
      }}
      onPressOut={() => ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions)}
    >
      <Animated.View style={[styles.toggle, { transform: [{ translateX }], backgroundColor: toggleColor }]} />
    </AnimatedTouchableOpacity>
  );
};
