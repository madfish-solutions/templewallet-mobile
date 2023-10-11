import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { Animated, StyleProp, View, ViewStyle } from 'react-native';

import { EventFn } from 'src/config/general';
import { useLayoutSizes } from 'src/hooks/use-layout-sizes.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { tileMargin, useSegmentedControlStyles } from './segmented-control.styles';

export interface SegmentedControlProps<T> extends TestIdProps {
  disabledIndexes?: number[];
  selectedIndex: number;
  values: T[];
  width?: number;
  onChange: EventFn<number>;
  style?: StyleProp<ViewStyle>;
  optionAnalyticsPropertiesFn?: (value: T, index: number) => object | undefined;
}

interface Props<T> extends SegmentedControlProps<T> {
  ValueComponent: FC<SegmentedControlValueComponentProps<T>>;
}

export interface SegmentedControlValueComponentProps<T> {
  item: T;
  isDisabled: boolean;
  isSelected: boolean;
}

const defaultOptionAnalyticsPropertiesFn = (_: unknown, index: number) => ({ index });

export const SegmentedControl = <T extends unknown>({
  disabledIndexes,
  selectedIndex,
  values,
  ValueComponent,
  width,
  style,
  testID,
  testIDProperties,
  optionAnalyticsPropertiesFn = defaultOptionAnalyticsPropertiesFn,
  onChange
}: PropsWithChildren<Props<T>>) => {
  const { trackEvent } = useAnalytics();
  const styles = useSegmentedControlStyles();
  const { layoutWidth, handleLayout } = useLayoutSizes();
  const tileWidth = ((width ?? layoutWidth) - 2 * tileMargin) / (values.length || 1);
  const translateX = useRef(new Animated.Value(selectedIndex * tileWidth)).current;

  useEffect(() => {
    if (tileWidth > 0) {
      Animated.spring(translateX, {
        toValue: selectedIndex * tileWidth,
        stiffness: 150,
        damping: 20,
        mass: 1,
        useNativeDriver: true
      }).start();
    }
  }, [selectedIndex, tileWidth]);

  const renderOption = useCallback(
    (item: T, index: number) => {
      const isDisabled = disabledIndexes?.includes(index) ?? false;

      return (
        <TouchableOpacity
          disabled={isDisabled}
          key={index}
          style={[styles.itemContainer, { width: tileWidth }]}
          hitSlop={{
            ...(index === 0 && { left: formatSize(12) }),
            top: formatSize(12),
            ...(index === values.length - 1 && { right: formatSize(12) }),
            bottom: formatSize(8)
          }}
          onPress={() => {
            trackEvent(testID, AnalyticsEventCategory.FormChange, {
              ...testIDProperties,
              ...optionAnalyticsPropertiesFn(item, index)
            });
            onChange(index);
          }}
        >
          <ValueComponent item={item} isDisabled={isDisabled} isSelected={index === selectedIndex} />
        </TouchableOpacity>
      );
    },
    [
      disabledIndexes,
      styles,
      tileWidth,
      trackEvent,
      testID,
      testIDProperties,
      onChange,
      ValueComponent,
      selectedIndex,
      values,
      optionAnalyticsPropertiesFn
    ]
  );

  return (
    <View style={[styles.container, { width }, style]} onLayout={handleLayout}>
      <Animated.View style={[styles.tile, { width: tileWidth, transform: [{ translateX }] }]} />

      <View style={styles.contentContainer}>{values.map(renderOption)}</View>
    </View>
  );
};
