import React, { FC, useCallback } from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { EventFn } from '../../config/general';
import { useSelectPercentageButtonStyles } from './select-percentage-button.styles';

interface Props {
  value: number;
  active: boolean;
  onPress: EventFn<number, void>;
}

export const SelectPercentageButton: FC<Props> = ({ value, active, onPress }) => {
  const styles = useSelectPercentageButtonStyles();
  const onPressHandler = useCallback(() => onPress(value), [value, onPress]);

  return (
    <TouchableOpacity style={[styles.buttonWrapper, active && styles.activeButton]} onPress={onPressHandler}>
      <Text style={styles.valueStyle}>{value}%</Text>
    </TouchableOpacity>
  );
};
