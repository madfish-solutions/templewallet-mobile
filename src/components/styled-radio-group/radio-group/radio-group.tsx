import React, { useMemo } from 'react';
import { View } from 'react-native';

import { showWarningToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import { RadioItem } from './radio-item';
import { groupStyles } from './styles';
import { RadioGroupProps } from './types';

export const RadioGroup = <T extends string>({
  items,
  value: currentValue,
  color = '#444',
  disabledColor = '#ccc',
  itemContainerStyle,
  disabledItemLabelStyle: disabledLabelStyle,
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
      ...item,
      selected: item.value === currentValue,
      onPress: (value: string) =>
        isDefined(item.disabledMessage) ? showWarningToast({ description: item.disabledMessage }) : handlePress(value)
    }));
  }, [items, currentValue, trackEvent, testID]);

  const totalDisabledLabelStyle = useMemo(
    () => [itemLabelStyle, disabledLabelStyle].flat(),
    [itemLabelStyle, disabledLabelStyle]
  );

  return (
    <View style={groupStyles.container}>
      {itemsLocal.map(item => (
        <RadioItem
          key={item.value}
          color={isDefined(item.disabledMessage) ? disabledColor : color}
          containerStyle={itemContainerStyle}
          labelStyle={isDefined(item.disabledMessage) ? totalDisabledLabelStyle : itemLabelStyle}
          testID={testID}
          {...item}
        />
      ))}
    </View>
  );
};
