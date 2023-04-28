import React from 'react';
import { Animated } from 'react-native';

import { isDefined } from '../../../../utils/is-defined';
import { SegmentedControlValueComponent } from '../../segmented-control';
import { useSegmentedControlColor } from '../../use-segmented-control-color.hook';
import { useTextSegmentControlValueStyles } from './text-segment-control-value.styles';

export const TextSegmentControlValue: SegmentedControlValueComponent<string> = ({
  item,
  isSelected,
  index,
  disabledIndexes
}) => {
  const styles = useTextSegmentControlValueStyles();
  const color = useSegmentedControlColor(isSelected);
  const disabled = disabledIndexes?.includes(index);

  return (
    <Animated.Text style={[styles.text, { color }, isDefined(disabled) && disabled && styles.disabled]}>
      {item}
    </Animated.Text>
  );
};
