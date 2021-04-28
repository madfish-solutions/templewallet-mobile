import { default as RNSlider, SliderProps } from '@react-native-community/slider';
import React, { FC } from 'react';
import { View } from 'react-native';

import { greyLight200, orangeLight200 } from '../../config/styles';
import { SliderStyles } from './slider.styles';

type Props = SliderProps & {
  leftElementRender?: Element;
  middleElementRender?: Element;
  rightElementRender?: Element;
};

export const Slider: FC<Props> = ({
  leftElementRender,
  middleElementRender,
  rightElementRender,
  style = { height: 40 },
  minimumTrackTintColor = orangeLight200,
  maximumTrackTintColor = greyLight200,
  // TODO: investigate how to fix type error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ref,
  ...props
}) => {
  return (
    <View>
      <RNSlider
        {...props}
        style={style}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
      />
      <View style={SliderStyles.bottomContainer}>
        {leftElementRender}
        {middleElementRender}
        {rightElementRender}
      </View>
    </View>
  );
};
