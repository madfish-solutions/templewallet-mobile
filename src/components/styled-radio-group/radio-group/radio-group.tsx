import React, { useMemo } from 'react';
import { View } from 'react-native';

import { RadioItem } from './radio-item';
import { groupStyles } from './styles';
import { RadioGroupProps } from './types';

export const RadioGroup = <T extends string>({
  items,
  value: currentValue,
  color = '#444',
  itemContainerStyle,
  itemLabelStyle,
  onPress
}: RadioGroupProps<T>) => {
  const itemsLocal = useMemo(() => {
    const handlePress = (value: string) => {
      if (value !== currentValue) {
        onPress(value as T);
      }
    };

    return items.map(item => ({
      key: item.value,
      ...item,
      selected: item.value === currentValue,
      onPress: handlePress
    }));
  }, [items, currentValue]);

  return (
    <View style={groupStyles.container}>
      {itemsLocal.map(item => (
        <RadioItem {...item} color={color} containerStyle={itemContainerStyle} labelStyle={itemLabelStyle} />
      ))}
    </View>
  );
};
