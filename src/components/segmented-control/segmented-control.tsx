import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { EventFn } from 'src/config/general';
import { useLayoutSizes } from 'src/hooks/use-layout-sizes.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { tileMargin, useSegmentedControlStyles } from './segmented-control.styles';

export interface SegmentedControlProps<T> extends TestIdProps {
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
  testID,
  testIDProperties,
  onChange
}: PropsWithChildren<Props<T>>) => {
  const { trackEvent } = useAnalytics();
  const styles = useSegmentedControlStyles();
  const { layoutWidth, handleLayout } = useLayoutSizes();
  const { trackEvent } = useAnalytics();
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
            hitSlop={{
              ...(index === 0 && { left: formatSize(12) }),
              top: formatSize(12),
              ...(index === values.length - 1 && { right: formatSize(12) }),
              bottom: formatSize(8)
            }}
            onPress={() => {
              trackEvent(testID, AnalyticsEventCategory.FormChange, { ...testIDProperties, index });
              onChange(index);
            }}
          >
            {renderValue({ item, isSelected: index === selectedIndex })}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
