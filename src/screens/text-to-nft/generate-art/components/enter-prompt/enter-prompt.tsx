import { useField } from 'formik';
import React, { FC } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { FormTextArea } from 'src/components/form-text-area/form-text-area';
import { StyledTextInputProps } from 'src/components/styled-text-input/styled-text-input.props';

import { useEnterPromptStyles } from './enter-prompt.styles';

interface Props extends Pick<StyledTextInputProps, 'placeholder'> {
  title: string;
  name: string;
  style?: StyleProp<ViewStyle>;
}

export const EnterPrompt: FC<Props> = ({ title, name, placeholder, style }) => {
  const styles = useEnterPromptStyles();

  const [field] = useField<string>(name);

  return (
    <View style={style}>
      <View style={styles.root}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.counter}>{`${field.value.length}/2000`}</Text>
      </View>

      <FormTextArea name={name} placeholder={placeholder} />
    </View>
  );
};
