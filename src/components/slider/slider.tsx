import RNSlider, { SliderProps } from '@react-native-community/slider';
import { debounce } from 'lodash-es';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { greyLight200, orangeLight200 } from '../../config/styles';
import { useSliderStyles } from './slider.styles';

type Props = Required<Pick<SliderProps, 'value' | 'onValueChange'>>;

export const Slider: FC<Props> = ({ value, onValueChange }) => {
  const styles = useSliderStyles();
  const debouncedValueChange = debounce(onValueChange);

  return (
    <>
      <RNSlider
        value={value}
        style={styles.slider}
        step={1}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor={orangeLight200}
        maximumTrackTintColor={greyLight200}
        onValueChange={debouncedValueChange}
      />
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomContainerText}>Low</Text>
        <Text style={styles.bottomContainerText}>Mid</Text>
        <Text style={styles.bottomContainerText}>High</Text>
      </View>
    </>
  );
};
