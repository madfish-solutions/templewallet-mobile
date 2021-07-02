import { useRef } from 'react';
import { Animated } from 'react-native';

import { ANIMATION_MAX_VALUE, ANIMATION_MIN_VALUE } from '../config/animation';

export const getAnimationValue = (rawValue: boolean | number) => {
  if (typeof rawValue === 'number') {
    return rawValue;
  }

  return rawValue ? ANIMATION_MAX_VALUE : ANIMATION_MIN_VALUE;
};

export const useAnimationRef = (initialRawValue: boolean | number = false) =>
  useRef(new Animated.Value(getAnimationValue(initialRawValue))).current;
