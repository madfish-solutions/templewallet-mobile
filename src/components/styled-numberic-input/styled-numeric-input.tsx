import React, { FC } from 'react';

import { emptyFn } from 'src/config/general';
import { useNumericInput } from 'src/hooks/use-numeric-input.hook';
import { TEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';

import { StyledTextInput } from '../styled-text-input/styled-text-input';

import { StyledNumericInputProps } from './styled-numeric-input.props';

export const StyledNumericInput: FC<StyledNumericInputProps> = ({
  value,
  minValue,
  maxValue,
  decimals,
  editable,
  placeholder,
  isError,
  isShowCleanButton,
  onBlur,
  onFocus,
  onChange = emptyFn,
  testID
}) => {
  const { stringValue, handleBlur, handleFocus, handleChange } = useNumericInput(
    value,
    decimals ?? TEZ_TOKEN_METADATA.decimals,
    minValue,
    maxValue,
    onChange,
    onBlur,
    onFocus
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
      testID={testID}
    />
  );
};
