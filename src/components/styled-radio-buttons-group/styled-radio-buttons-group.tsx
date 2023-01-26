import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';

import { EventFn } from 'src/config/general';
import { useColors } from 'src/styles/use-colors';

import { RadioItemInterface, RadioGroup } from './radio-group';
import { useStyledRadioButtonsGroupStyles } from './styled-radio-buttons-group.styles';

interface RadioButton<T extends string> {
  value: T;
  label: string;
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

  const radioButtons = useMemo<RadioItemInterface[]>(
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

  const onRadioButtonPress = (radioButtonsArray: RadioItemInterface[]) => {
    const selectedButton = radioButtonsArray.find(radioButton => radioButton.selected);

    selectedButton && onChange(selectedButton.value as T);
  };

  return (
    <View style={styles.container}>
      <RadioGroup items={radioButtons} onPress={onRadioButtonPress} onEditButtonPress={onEditButtonPress} />
    </View>
  );
};
