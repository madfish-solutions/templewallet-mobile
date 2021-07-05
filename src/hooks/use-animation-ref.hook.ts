import { useRef } from 'react';
import { Animated } from 'react-native';

import { ANIMATION_MAX_VALUE, ANIMATION_MIN_VALUE } from '../config/animation';

export const getAnimationValue = (flag: boolean) => (flag ? ANIMATION_MAX_VALUE : ANIMATION_MIN_VALUE);

export const useAnimationRef = (flag = false) => useRef(new Animated.Value(getAnimationValue(flag))).current;
