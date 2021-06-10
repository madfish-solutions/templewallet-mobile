import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

import { emptyFn } from '../../config/general';
import { isDefined } from '../../utils/is-defined';
import { StyledTextInput } from '../styled-text-input/styled-text-input';
import { StyledNumericInputProps } from './styled-numeric-input.props';

const DEFAULT_MIN_VALUE = new BigNumber(0);
const DEFAULT_MAX_VALUE = new BigNumber(Number.MAX_SAFE_INTEGER);

export const StyledNumericInput: FC<StyledNumericInputProps> = ({
  decimals = 6,
  value,
  min = DEFAULT_MIN_VALUE,
  max = DEFAULT_MAX_VALUE,
  editable,
  isError,
  isShowCleanButton,
  onBlur = emptyFn,
  onFocus = emptyFn,
  onChange = emptyFn
}) => {
  const [stringValue, setStringValue] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(
    () => void (!focused && setStringValue(isDefined(value) ? new BigNumber(value).toFixed() : '')),
    [setStringValue, focused, value]
  );

  const handleChange = (newStringValue: string) => {
    let normalizedStringValue = newStringValue.replace(/ /g, '').replace(/,/g, '.');
    const newValue = new BigNumber(normalizedStringValue || 0).decimalPlaces(decimals);

    const indexOfDot = normalizedStringValue.indexOf('.');
    const decimalsCount = indexOfDot === -1 ? 0 : normalizedStringValue.length - indexOfDot - 1;
    if (decimalsCount > decimals) {
      normalizedStringValue = normalizedStringValue.substring(0, indexOfDot + decimals + 1);
    }

    if (newValue.gte(min) && newValue.lte(max)) {
      setStringValue(normalizedStringValue);
      onChange(normalizedStringValue !== '' ? newValue : undefined);
    }
  };

  const handleFocus = (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    onFocus(evt);
  };

  const handleBlur = (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    onBlur(evt);
  };

  return (
    <StyledTextInput
      editable={editable}
      value={stringValue}
      isError={isError}
      isShowCleanButton={isShowCleanButton}
      keyboardType="numeric"
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChangeText={handleChange}
    />
  );
};
