import React from 'react';
import { View, ViewStyle } from 'react-native';

import { EventFn } from 'src/config/general';
import { useColors } from 'src/styles/use-colors';

import { RadioItemInterface, RadioGroup } from './radio-group';
import { useStyledRadioButtonsGroupStyles } from './styles';

interface StyledRadioItem<T extends string> {
  value: T;
  label: string;
  buttons?: RadioItemInterface['buttons'];
}

export interface StyledRadioGroupProps<T extends string> {
  items: StyledRadioItem<T>[];
}

interface Props<T extends string> extends StyledRadioGroupProps<T> {
  value: T;
  onChange: EventFn<T>;
  labelStyle?: ViewStyle;
}

export const StyledRadioGroup = <T extends string>({ value, items, onChange, labelStyle }: Props<T>) => {
  const colors = useColors();
  const styles = useStyledRadioButtonsGroupStyles();

  const onRadioItemPress = (itemValue: string) => void onChange(itemValue as T);

  return (
    <View style={styles.container}>
      <RadioGroup
        items={items}
        value={value}
        onPress={onRadioItemPress}
        color={colors.orange}
        itemContainerStyle={styles.itemContainer}
        itemLabelStyle={[styles.label, labelStyle]}
      />
    </View>
  );
};
