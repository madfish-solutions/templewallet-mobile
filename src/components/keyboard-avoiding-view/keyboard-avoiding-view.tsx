import React, { FC, useEffect } from 'react';
import { Animated } from 'react-native';

import { ANIMATION_DURATION_FAST } from '../../config/animation';
import { useAnimationRef } from '../../hooks/use-animation-ref.hook';
import { useKeyboard } from '../../hooks/use-keyboard.hook';
import { animateTiming } from '../../utils/animate-timing.util';

export const KeyboardAvoidingView: FC = ({ children }) => {
  const { keyboardHeight } = useKeyboard();

  const height = useAnimationRef();

  useEffect(
    () => animateTiming(height, { toValue: keyboardHeight, duration: ANIMATION_DURATION_FAST, useNativeDriver: false }),
    [keyboardHeight]
  );

  return (
    <>
      {children}
      <Animated.View style={{ height }} />
    </>
  );
};
