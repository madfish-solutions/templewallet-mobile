import React, { FC } from 'react';
import { TextInput, TextInputProps } from 'react-native';

import { useColors } from '../../styles/use-colors';
import { useStyledTextInputStyles } from './styled-text-input.styles';

interface Props extends Omit<TextInputProps, 'style'> {
  isError?: boolean;
}

export const StyledTextInput: FC<Props> = ({ isError, multiline, ...props }) => {
  const styles = useStyledTextInputStyles();
  const colors = useColors();

  return (
    <TextInput
      style={[multiline ? styles.multiline : styles.regular, isError && styles.error]}
      multiline={multiline}
      placeholderTextColor={colors.gray3}
      selectionColor={colors.orange}
      {...props}
    />
  );
};
