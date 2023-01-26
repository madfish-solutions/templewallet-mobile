import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';

import { EventFn } from 'src/config/general';
import { useColors } from 'src/styles/use-colors';

import { RadioItemInterface, RadioGroup } from './radio-group';
import { useStyledRadioButtonsGroupStyles } from './styled-radio-buttons-group.styles';

interface RadioButton<T extends string> {
  value: T;
  label: string;
  /** Irrelevant, if `onEditButtonPress` is not passed as well */
  editDisabled?: boolean;
}

export interface RadioButtonsGroupProps<T extends string> {
  buttons: RadioButton<T>[];
}

interface Props<T extends string> extends RadioButtonsGroupProps<T> {
  value: T;
  onChange: EventFn<T>;
  onEditButtonPress?: (id: string) => void;
  labelStyle?: ViewStyle;
}

export const StyledRadioButtonsGroup = <T extends string>({
  value,
  buttons,
  onChange,
  onEditButtonPress,
  labelStyle
}: Props<T>) => {
  const colors = useColors();
  const styles = useStyledRadioButtonsGroupStyles();

  const items = useMemo<RadioItemInterface[]>(
    () =>
      buttons.map(radioButton => ({
        ...radioButton,
        id: radioButton.value,
        labelStyle: [styles.label, labelStyle],
        containerStyle: styles.itemContainer,
        color: colors.orange,
        selected: radioButton.value === value
      })),
    [buttons, value, styles, colors]
  );

  const onRadioItemPress = (items: RadioItemInterface[]) => {
    const selectedItem = items.find(item => item.selected);

    selectedItem && onChange(selectedItem.value as T);
  };

  return (
    <View style={styles.container}>
      <RadioGroup items={items} onPress={onRadioItemPress} onEditButtonPress={onEditButtonPress} />
    </View>
  );
};
