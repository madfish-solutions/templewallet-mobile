import React, { useMemo } from 'react';
import { View } from 'react-native';

import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { RadioItem } from './radio-item';
import { groupStyles } from './styles';
import { RadioGroupProps } from './types';

export const RadioGroup = <T extends string>({
  items,
  value: currentValue,
  color = '#444',
  itemContainerStyle,
  itemLabelStyle,
  onPress,
  testID
}: RadioGroupProps<T>) => {
  const { trackEvent } = useAnalytics();

  const itemsLocal = useMemo(() => {
    const handlePress = (value: string) => {
      if (value !== currentValue) {
        onPress(value as T);
        trackEvent(testID, AnalyticsEventCategory.FormChange, { value });
      }
    };

    return items.map(item => ({
      key: item.value,
      ...item,
      selected: item.value === currentValue,
      onPress: handlePress
    }));
  }, [items, currentValue, trackEvent, testID]);

  return (
    <View style={groupStyles.container}>
      {itemsLocal.map(item => (
        <RadioItem
          {...item}
          color={color}
          containerStyle={itemContainerStyle}
          labelStyle={itemLabelStyle}
          testID={testID}
        />
      ))}
    </View>
  );
};
