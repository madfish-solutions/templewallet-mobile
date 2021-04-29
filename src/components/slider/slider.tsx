import { default as RNSlider, SliderProps } from '@react-native-community/slider';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { greyLight200, orangeLight200 } from '../../config/styles';
import { SliderStyles } from './slider.styles';

export const Slider: FC<SliderProps> = ({
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
        style={SliderStyles.slider}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
      />
      <View style={SliderStyles.bottomContainer}>
        <Text>Low</Text>
        <Text>Mid</Text>
        <Text>High</Text>
      </View>
    </View>
  );
};
