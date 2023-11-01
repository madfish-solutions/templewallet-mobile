import { useEffect } from 'react';
import { Animated } from 'react-native';

import { animateTiming, AnimateTimingConfig } from '../utils/animate-timing.util';

import { getAnimationValue } from './use-animation-ref.hook';

export const useUpdateAnimation = (
  animation: Animated.Value,
  flag: boolean,
  config: Omit<AnimateTimingConfig, 'toValue'> = {}
) => {
  useEffect(
    () => animateTiming(animation, { useNativeDriver: true, ...config, toValue: getAnimationValue(flag) }),
    [flag]
  );
};
