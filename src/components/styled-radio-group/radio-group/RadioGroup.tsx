import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { RadioItem } from './RadioItem';
import { RadioGroupProps } from './types';

export function RadioGroup({ containerStyle, layout = 'column', onPress, items, selectedId }: RadioGroupProps) {
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
    <View style={[styles.container, { flexDirection: layout }, containerStyle]}>
      {itemsLocal.map(item => (
        <RadioItem {...item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  }
});
