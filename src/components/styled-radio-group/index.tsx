import React from 'react';
import { View, ViewStyle } from 'react-native';

import { useColors } from 'src/styles/use-colors';

import { TestIdProps } from '../../interfaces/test-id.props';

import { RadioItemInterface, RadioGroup } from './radio-group';
import { useStyledRadioButtonsGroupStyles } from './styles';

export interface StyledRadioGroupProps<T extends string> {
  items: RadioItemInterface<T>[];
}

interface Props<T extends string> extends StyledRadioGroupProps<T>, TestIdProps {
  value: T;
  onChange: (value: T) => void;
  labelStyle?: ViewStyle;
  disabledLabelStyle?: ViewStyle;
}

export const StyledRadioGroup = <T extends string>({
  value,
  items,
  onChange,
  disabledLabelStyle,
  labelStyle,
  testID
}: Props<T>) => {
  const colors = useColors();
  const styles = useStyledRadioButtonsGroupStyles();

  return (
    <View style={styles.container}>
      <RadioGroup
        items={items}
        value={value}
        onPress={onChange}
        color={colors.orange}
        disabledColor={colors.disabled}
        itemContainerStyle={styles.itemContainer}
        itemLabelStyle={[styles.label, labelStyle]}
        disabledItemLabelStyle={[styles.label, disabledLabelStyle ?? styles.disabledLabel]}
        testID={testID}
      />
    </View>
  );
};
