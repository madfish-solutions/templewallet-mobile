import LottieView, { AnimationObject, LottieViewProps } from 'lottie-react-native';
import React, { memo } from 'react';

export interface LottieAnimationProps extends Omit<LottieViewProps, 'source'> {
  source: AnimationObject;
}

/**
 * Shared native Lottie renderer for bundled Bodymovin JSON animations.
 */
export const LottieAnimation = memo<LottieAnimationProps>(({ source, autoPlay = true, loop = true, ...props }) => (
  <LottieView source={source} autoPlay={autoPlay} loop={loop} {...props} />
));
