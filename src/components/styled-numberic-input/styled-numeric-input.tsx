import React, { FC } from 'react';

import { emptyFn } from 'src/config/general';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useNumericInput } from 'src/hooks/use-numeric-input.hook';

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
  const { metadata } = useNetworkInfo();

  const { stringValue, handleBlur, handleFocus, handleChange } = useNumericInput(
    value,
    decimals ?? metadata.decimals,
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
