import React, { FC, useState } from 'react';
import { NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextInputProps } from 'react-native';

import { emptyFn } from '../../config/general';
import { StyledTextInputStyles } from './styled-text-input.styles';

export const StyledTextInput: FC<Omit<TextInputProps, 'style'>> = ({
  multiline,
  onBlur = emptyFn,
  onFocus = emptyFn,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur(e);
  };

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus(e);
  };

  return (
    <TextInput
      style={[
        multiline ? StyledTextInputStyles.multiline : StyledTextInputStyles.regular,
        isFocused && StyledTextInputStyles.focus
      ]}
      multiline={multiline}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
};
