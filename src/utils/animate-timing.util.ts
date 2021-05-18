import { Animated, Easing } from 'react-native';

import { ANIMATION_DURATION } from '../config/animation';
import { emptyFn } from '../config/general';
import { Optional } from '../interfaces/optional.type';

export type AnimateTimingConfig = Optional<Animated.TimingAnimationConfig, 'useNativeDriver'>;

export const animateTiming = (
  animation: Animated.AnimatedValue | Animated.AnimatedValueXY,
  {
    toValue,
    easing = Easing.linear,
    duration = ANIMATION_DURATION,
    delay = 0,
    useNativeDriver = true
  }: AnimateTimingConfig,
  callback = emptyFn
) =>
  Animated.timing(animation, {
    toValue,
    duration,
    easing,
    delay,
    useNativeDriver
  }).start(callback);
