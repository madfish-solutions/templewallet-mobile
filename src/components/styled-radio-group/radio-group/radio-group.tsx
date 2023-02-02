import React, { useMemo } from 'react';
import { View } from 'react-native';

import { RadioItem } from './radio-item';
import { groupStyles } from './styles';
import { RadioGroupProps } from './types';

export function RadioGroup({ containerStyle, onPress, items, selectedId }: RadioGroupProps) {
  const handlePress = (id: string) => {
    if (id !== selectedId && onPress) {
      onPress(id);
    }
  };

  const itemsLocal = useMemo(
    () =>
      items.map(item => ({
        key: item.id,
        ...item,
        selected: item.id === selectedId,
        onPress: (id: string) => {
          handlePress(id);

          if (item.onPress) {
            item.onPress(id);
          }
        }
      })),
    [items, selectedId]
  );

  return (
    <View style={[groupStyles.container, containerStyle]}>
      {itemsLocal.map(item => (
        <RadioItem {...item} />
      ))}
    </View>
  );
}
