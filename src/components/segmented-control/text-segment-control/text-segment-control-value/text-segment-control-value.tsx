import React from 'react';
import { Animated } from 'react-native';

import { conditionalStyle } from 'src/utils/conditional-style';

import { SegmentedControlValueComponent } from '../../segmented-control';
import { useSegmentedControlColor } from '../../use-segmented-control-color.hook';

import { useTextSegmentControlValueStyles } from './text-segment-control-value.styles';

export const TextSegmentControlValue: SegmentedControlValueComponent<string> = ({ item, isDisabled, isSelected }) => {
  const styles = useTextSegmentControlValueStyles();
  const color = useSegmentedControlColor(isSelected, isDisabled);

  return (
    <Animated.Text style={[styles.text, { color }, conditionalStyle(isDisabled, styles.disabled)]}>
      {item}
    </Animated.Text>
  );
};
