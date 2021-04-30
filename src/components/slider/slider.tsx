import RNSlider, { SliderProps } from '@react-native-community/slider';
import { debounce } from 'lodash-es';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { greyLight200, orangeLight200 } from '../../config/styles';
import { SliderStyles } from './slider.styles';

type Props = Required<Pick<SliderProps, 'value' | 'onValueChange'>>;

export const Slider: FC<Props> = ({ value, onValueChange }) => {
  const debouncedValueChange = debounce(onValueChange);

  return (
    <View>
      <RNSlider
        value={value}
        style={SliderStyles.slider}
        step={1}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor={orangeLight200}
        maximumTrackTintColor={greyLight200}
        onValueChange={debouncedValueChange}
      />
      <View style={SliderStyles.bottomContainer}>
        <Text>Low</Text>
        <Text>Mid</Text>
        <Text>High</Text>
      </View>
    </View>
  );
}
