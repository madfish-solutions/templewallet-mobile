import { DependencyList, useMemo } from 'react';
import { Animated } from 'react-native';

import { ANIMATION_INPUT_RANGE } from '../config/animation';
import { Optional } from '../interfaces/optional.type';

export const useAnimationInterpolate = (
  animatedValue: Animated.AnimatedValue,
  config: Optional<Animated.InterpolationConfigType, 'inputRange'>,
  deps: DependencyList = []
) =>
  useMemo(
    () => animatedValue.interpolate({ inputRange: ANIMATION_INPUT_RANGE, extrapolate: 'clamp', ...config }),
    [animatedValue, ...deps]
  );
