import React, { FC } from 'react';
// eslint-disable-next-line import/default
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import { Defs, G, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

export const VECTOR_SIZE = 38;

const DASH_ARRAY = `${VECTOR_SIZE} 120`;
const LINE_COLOR = '#007AFF';

const FIRST_GRADIENT_ID = 'grad1';
const SECOND_GRADIENT_ID = 'grad2';

const FIRST_LINE_STROKE = `url(#${FIRST_GRADIENT_ID})`;
const SECOND_LINE_STROKE = `url(#${SECOND_GRADIENT_ID})`;

interface Props {
  progress: SharedValue<number>;
  size: number;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export const LoaderLines: FC<Props> = ({ progress, size = 64 }) => {
  const firstLinePath = useAnimatedProps(() => ({
    strokeDashoffset: progress.value
  }));
  const secondLinePath = useAnimatedProps(() => ({
    strokeDashoffset: progress.value + VECTOR_SIZE * 2
  }));

  const firstLineGradient = useAnimatedGradient(progress);
  const secondLineGradient = useAnimatedGradient(progress, Math.PI / 2);

  return (
    <Svg width={size} height={size} viewBox="-1 0 66 64" fill="none">
      <Defs>
        <AnimatedGradient animatedProps={firstLineGradient} id={FIRST_GRADIENT_ID}>
          <Stop offset="0%" stopColor={LINE_COLOR} />
          <Stop offset="100%" stopColor={LINE_COLOR} stopOpacity="0" />
        </AnimatedGradient>
        <AnimatedGradient animatedProps={secondLineGradient} id={SECOND_GRADIENT_ID}>
          <Stop offset="0%" stopColor={LINE_COLOR} />
          <Stop offset="100%" stopColor={LINE_COLOR} stopOpacity="0" />
        </AnimatedGradient>
      </Defs>
      <G>
        <AnimatedPath
          animatedProps={firstLinePath}
          strokeDasharray={DASH_ARRAY}
          stroke={FIRST_LINE_STROKE}
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M0,32a32,16 0 1,0 64,0a32,16 0 1,0 -64,0Z"
        />
        <AnimatedPath
          animatedProps={secondLinePath}
          strokeDasharray={DASH_ARRAY}
          stroke={SECOND_LINE_STROKE}
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M0,32a32,16 0 1,0 64,0a32,16 0 1,0 -64,0Z"
        />
      </G>
    </Svg>
  );
};

const useAnimatedGradient = (progress: SharedValue<number>, offset = -Math.PI / 2) => {
  return useAnimatedProps(() => {
    // from 0 to 1
    const norma = -progress.value / (VECTOR_SIZE * 4);
    // from -0.5pi to 1.5pi
    const rads = norma * (Math.PI * 2) + offset;
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
};
