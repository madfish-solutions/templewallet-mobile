import RNSlider, { SliderProps } from '@react-native-community/slider';
import { debounce } from 'lodash-es';
import React, { FC } from 'react';
import { View } from 'react-native';

import { greyLight200, orangeLight200 } from '../../config/styles';
import { formatSize } from '../../styles/format-size';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useSliderStyles } from './slider.styles';

type Props = Required<Pick<SliderProps, 'value' | 'onValueChange'>> &
  Pick<SliderProps, 'minimumValue' | 'maximumValue' | 'step'>;

export const Slider: FC<Props> = ({ value, onValueChange, minimumValue = 0, maximumValue = 100, step = 1 }) => {
  const styles = useSliderStyles();
  const debouncedValueChange = debounce(onValueChange);

  return (
    <>
      <RNSlider
        value={value}
        style={styles.slider}
        step={step}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        minimumTrackTintColor={orangeLight200}
        thumbTintColor={orangeLight200}
        maximumTrackTintColor={greyLight200}
        onValueChange={debouncedValueChange}
      />
      <View style={styles.bottomContainer}>
        <Icon size={formatSize(24)} name={IconNameEnum.Slow} style={styles.icon} />
        <Icon size={formatSize(24)} name={IconNameEnum.NormalSpeed} style={styles.icon} />
        <Icon size={formatSize(24)} name={IconNameEnum.Fast} style={styles.icon} />
      </View>
    </>
  );
};
