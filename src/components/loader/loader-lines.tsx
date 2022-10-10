import React, { FC } from 'react';
// eslint-disable-next-line import/default
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import { Defs, G, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

interface Props {
  progress: SharedValue<number>;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export const LoaderLines: FC<Props> = ({ progress }) => {
  const animatedProps1 = useAnimatedProps(() => {
    return {
      strokeDashoffset: progress.value
    };
  });

  const animatedProps2 = useAnimatedProps(() => {
    return {
      strokeDashoffset: progress.value + 38 * 2
    };
  });

  const animatedProps3 = useAnimatedProps(() => {
    // from 0 to 1
    const norma = -progress.value / (38 * 4);
    // from -0.5pi to 1.5pi
    const rads = norma * (Math.PI * 2) - Math.PI / 2;
    // from 0 to 1 to 0 to -1 to 0
    const rx1 = Math.cos(rads);
    const rx2 = Math.cos(rads - Math.PI / 2);
    // from 50% to 100% to 50% to 0% to 50%
    const x1 = (rx1 + 1) * 50;
    const x2 = (rx2 + 1) * 50;

    // from -1 to 0 to 1 to 0 to -1
    const ry1 = Math.sin(rads);
    const ry2 = Math.sin(rads - Math.PI / 2);
    // from 100% to 50% to 0% to 50% to 100%
    const y1 = 100 - (ry1 + 1) * 50;
    const y2 = 100 - (ry2 + 1) * 50;

    return {
      x1: `${x1}%`,
      x2: `${x2}%`,
      y1: `${y1}%`,
      y2: `${y2}%`
    };
  });

  const animatedProps4 = useAnimatedProps(() => {
    // from 0 to 1
    const norma = -progress.value / (38 * 4);
    // from -0.5pi to 1.5pi
    const rads = norma * (Math.PI * 2) + Math.PI / 2;
    // from 0 to 1 to 0 to -1 to 0
    const rx1 = Math.cos(rads);
    const rx2 = Math.cos(rads - Math.PI / 2);
    // from 50% to 100% to 50% to 0% to 50%
    const x1 = (rx1 + 1) * 50;
    const x2 = (rx2 + 1) * 50;

    // from -1 to 0 to 1 to 0 to -1
    const ry1 = Math.sin(rads);
    const ry2 = Math.sin(rads - Math.PI / 2);
    // from 100% to 50% to 0% to 50% to 100%
    const y1 = 100 - (ry1 + 1) * 50;
    const y2 = 100 - (ry2 + 1) * 50;

    return {
      x1: `${x1}%`,
      x2: `${x2}%`,
      y1: `${y1}%`,
      y2: `${y2}%`
    };
  });

  return (
    <Svg width="64" height="64" viewBox="-1 0 66 64" fill="none">
      <Defs>
        <AnimatedGradient animatedProps={animatedProps3} id="grad1">
          <Stop offset="0%" stopColor="#007AFF" />
          <Stop offset="100%" stopColor="#007AFF" stopOpacity="0" />
        </AnimatedGradient>
        <AnimatedGradient animatedProps={animatedProps4} id="grad2">
          <Stop offset="0%" stopColor="#007AFF" />
          <Stop offset="100%" stopColor="#007AFF" stopOpacity="0" />
        </AnimatedGradient>
      </Defs>
      <G>
        <AnimatedPath
          animatedProps={animatedProps1}
          strokeDasharray={'38 120'}
          stroke="url(#grad1)"
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M0,32a32,16 0 1,0 64,0a32,16 0 1,0 -64,0Z"
        />
        <AnimatedPath
          animatedProps={animatedProps2}
          strokeDasharray={'38 120'}
          stroke="url(#grad2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M0,32a32,16 0 1,0 64,0a32,16 0 1,0 -64,0Z"
        />
      </G>
    </Svg>
  );
};
