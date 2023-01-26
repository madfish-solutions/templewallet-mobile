import { isEqual } from 'lodash-es';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RadioButton } from './RadioButton';
import { RadioItemInterface, RadioGroupProps } from './types';

export function RadioGroup({
  containerStyle,
  layout = 'column',
  onPress,
  onEditButtonPress,
  items: radioButtons
}: RadioGroupProps) {
  const [radioButtonsLocal, setRadioButtonsLocal] = useState<RadioItemInterface[]>(radioButtons);

  if (!isEqual(radioButtons, radioButtonsLocal)) {
    setRadioButtonsLocal(radioButtons);
  }

  function handlePress(id: string) {
    for (const button of radioButtonsLocal) {
      if (button.selected === true && button.id === id) {
        return;
      }
      button.selected = button.id === id;
    }
    setRadioButtonsLocal([...radioButtonsLocal]);
    if (onPress) {
      onPress(radioButtonsLocal);
    }
  }

  return (
    <View style={[styles.container, { flexDirection: layout }, containerStyle]}>
      {radioButtonsLocal.map(button => (
        <RadioButton
          {...button}
          key={button.id}
          onPress={(id: string) => {
            handlePress(id);
            if (button.onPress && typeof button.onPress === 'function') {
              button.onPress(id);
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
