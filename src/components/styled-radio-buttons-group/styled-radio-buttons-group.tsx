import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';

import { EventFn } from '../../config/general';
import { useColors } from '../../styles/use-colors';
import { isDefined } from '../../utils/is-defined';
import { useStyledRadioButtonsGroupStyles } from './styled-radio-buttons-group.styles';

interface RadioButton<T extends string> {
  value: T;
  label: string;
}

export interface RadioButtonsGroupProps<T extends string> {
  buttons: RadioButton<T>[];
}

interface Props<T extends string> extends RadioButtonsGroupProps<T> {
  value: T;
  onChange: EventFn<T>;
  labelStyle?: ViewStyle;
}

export const StyledRadioButtonsGroup = <T extends string>({ value, buttons, onChange, labelStyle }: Props<T>) => {
  const colors = useColors();
  const styles = useStyledRadioButtonsGroupStyles();

  const radioButtons = useMemo<RadioButtonProps[]>(
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

  function onPressRadioButton(radioButtonsArray: RadioButtonProps[]) {
    const selectedButton = radioButtonsArray.find(radioButton => radioButton.selected);

    isDefined(selectedButton) && onChange(selectedButton.value as T);
  }

  return (
    <View style={styles.container}>
      <RadioGroup radioButtons={radioButtons} onPress={onPressRadioButton} />
    </View>
  );
};
