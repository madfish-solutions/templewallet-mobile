import React from 'react';
import { Animated } from 'react-native';

import { SegmentedControlValueComponent } from '../../segmented-control';
import { useSegmentedControlColor } from '../../use-segmented-control-color.hook';
import { useTextSegmentControlValueStyles } from './text-segment-control-value.styles';

export const TextSegmentControlValue: SegmentedControlValueComponent<string> = ({ item, isSelected }) => {
  const styles = useTextSegmentControlValueStyles();
  const color = useSegmentedControlColor(isSelected);

  return <Animated.Text style={[styles.text, { color }]}>{item}</Animated.Text>;
};
