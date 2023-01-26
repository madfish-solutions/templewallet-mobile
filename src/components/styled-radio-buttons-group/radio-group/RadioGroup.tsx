import { isEqual } from 'lodash-es';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RadioItem } from './RadioItem';
import { RadioItemInterface, RadioGroupProps } from './types';

export function RadioGroup({ containerStyle, layout = 'column', onPress, onEditButtonPress, items }: RadioGroupProps) {
  const [itemsLocal, setItemsLocal] = useState<RadioItemInterface[]>(items);

  if (!isEqual(items, itemsLocal)) {
    setItemsLocal(items);
  }

  function handlePress(id: string) {
    for (const item of itemsLocal) {
      if (item.selected === true && item.id === id) {
        return;
      }
      item.selected = item.id === id;
    }
    setItemsLocal([...itemsLocal]);
    if (onPress) {
      onPress(itemsLocal);
    }
  }

  return (
    <View style={[styles.container, { flexDirection: layout }, containerStyle]}>
      {itemsLocal.map(item => (
        <RadioItem
          {...item}
          key={item.id}
          onPress={(id: string) => {
            handlePress(id);
            if (item.onPress && typeof item.onPress === 'function') {
              item.onPress(id);
            }
          }}
          onEditPress={onEditButtonPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  }
});
