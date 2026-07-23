import LottieView, { AnimationObject, LottieViewProps } from 'lottie-react-native';
import React, { memo } from 'react';

interface LottieAnimationProps extends Omit<LottieViewProps, 'source'> {
  source: AnimationObject;
}

export const LottieAnimation = memo<LottieAnimationProps>(({ source, autoPlay = true, loop = true, ...props }) => (
  <LottieView source={source} autoPlay={autoPlay} loop={loop} {...props} />
));
