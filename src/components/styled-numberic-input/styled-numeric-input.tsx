import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

import { emptyFn, EventFn } from '../../config/general';
import { isDefined } from '../../utils/is-defined';
import { StyledTextInput, StyledTextInputProps } from '../styled-text-input/styled-text-input';

interface Props
  extends Pick<StyledTextInputProps, 'editable' | 'isError' | 'isShowCleanButton' | 'onBlur' | 'onFocus'> {
  decimals?: number;
  value?: BigNumber;
  min?: BigNumber;
  max?: BigNumber;
  onChange?: EventFn<BigNumber | undefined>;
}

const defaultMin = new BigNumber(0);
const defaultMax = new BigNumber(Number.MAX_SAFE_INTEGER);

export const StyledNumericInput: FC<Props> = ({
  decimals = 6,
  value,
  min = defaultMin,
  max = defaultMax,
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
