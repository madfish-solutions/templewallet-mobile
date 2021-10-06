import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { EventFn } from '../../config/general';
import { useLayoutSizes } from '../../hooks/use-layout-sizes.hook';
import { tileMargin, useSegmentedControlStyles } from './segmented-control.styles';

export interface SegmentedControlProps<T> {
  selectedIndex: number;
  values: T[];
  width?: number;
  onChange: EventFn<number>;
}

interface Props<T> extends SegmentedControlProps<T> {
  renderValue: SegmentedControlValueComponent<T>;
}

export type SegmentedControlValueComponent<T> = FC<{
  item: T;
  isSelected: boolean;
}>;

export const SegmentedControl = <T extends unknown>({
  selectedIndex,
  values,
  renderValue,
  width,
  onChange
}: PropsWithChildren<Props<T>>) => {
  const styles = useSegmentedControlStyles();
  const { layoutWidth, handleLayout } = useLayoutSizes();
  const tileWidth = ((width ?? layoutWidth) - 2 * tileMargin) / (values.length || 1);
  const translateX = useRef(new Animated.Value(selectedIndex * tileWidth)).current;

  useEffect(
    () =>
      Animated.spring(translateX, {
        toValue: selectedIndex * tileWidth,
        stiffness: 150,
        damping: 20,
        mass: 1,
        useNativeDriver: true
      }).start(),
    [selectedIndex, tileWidth]
  );

  return (
    <View style={[styles.container, { width }]} onLayout={handleLayout}>
      <Animated.View style={[styles.tile, { width: tileWidth, transform: [{ translateX }] }]} />

      <View style={styles.contentContainer}>
        {values.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.itemContainer, { width: tileWidth }]}
            onPress={() => onChange(index)}
          >
            {renderValue({ item, isSelected: index === selectedIndex })}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
