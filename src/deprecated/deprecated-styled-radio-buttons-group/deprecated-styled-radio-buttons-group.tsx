import React, { useMemo } from 'react';
import { View } from 'react-native';
import { RadioGroup, RadioButtonProps } from 'react-native-radio-buttons-group';

import { EventFn } from '../../config/general';
import { useColors } from '../../styles/use-colors';
import { isDefined } from '../../utils/is-defined';
import { useStyledRadioButtonsGroupStyles } from './deprecated-styled-radio-buttons-group.styles';

export interface DeprecatedRadioButton<T extends string> {
  value: T;
  label: string;
}

export interface DeprecatedRadioButtonsGroupProps<T extends string> {
  buttons: DeprecatedRadioButton<T>[];
}

interface Props<T extends string> extends DeprecatedRadioButtonsGroupProps<T> {
  value: T;
  onChange: EventFn<T>;
}

/*** @deprecated */
export const DeprecatedStyledRadioButtonsGroup = <T extends string>({ value, buttons, onChange }: Props<T>) => {
  const colors = useColors();
  const styles = useStyledRadioButtonsGroupStyles();

  const radioButtons = useMemo<RadioButtonProps[]>(
    () =>
      buttons.map(radioButton => ({
        ...radioButton,
        id: radioButton.value,
        labelStyle: styles.label,
        containerStyle: [styles.itemContainer],
        color: colors.orange,
        selected: radioButton.value === value
      })),
    [buttons, value, styles, colors]
  );
  const onPressRadioButton = (radioButtonsArray: RadioButtonProps[]) => {
    const selectedButton = radioButtonsArray.find(radioButton => radioButton.selected);

    isDefined(selectedButton) && onChange(selectedButton.value as T);
  };

  return (
    <View style={styles.container}>
      <RadioGroup radioButtons={radioButtons} onPress={onPressRadioButton} />
    </View>
  );
};
