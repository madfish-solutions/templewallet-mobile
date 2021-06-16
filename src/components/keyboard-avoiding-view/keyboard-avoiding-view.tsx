import { animateTiming, ANIMATION_DURATION_FAST, useAnimationRef } from 'animation';
import React, { FC, useEffect } from 'react';
import { Animated } from 'react-native';

import { useKeyboard } from '../../hooks/use-keyboard.hook';

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
