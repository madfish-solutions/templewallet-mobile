import React, { FC } from 'react';

import { emptyFn } from '../../config/general';
import { useNumericInput } from '../../hooks/use-numeric-input.hook';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { StyledTextInput } from '../styled-text-input/styled-text-input';
import { StyledNumericInputProps } from './styled-numeric-input.props';

export const StyledNumericInput: FC<StyledNumericInputProps> = ({
  value,
  decimals = TEZ_TOKEN_METADATA.decimals,
  editable,
  placeholder,
  isError,
  isShowCleanButton,
  onBlur,
  onFocus,
  onChange = emptyFn
}) => {
  const { stringValue, handleBlur, handleFocus, handleChange } = useNumericInput(
    value,
    decimals,
    onBlur,
    onFocus,
    onChange
  );

  return (
    <StyledTextInput
      editable={editable}
      placeholder={placeholder}
      value={stringValue}
      isError={isError}
      isShowCleanButton={isShowCleanButton}
      autoCapitalize="words"
      keyboardType="numeric"
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChangeText={handleChange}
    />
  );
};
