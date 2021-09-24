import { BigNumber } from 'bignumber.js';
import { useEffect, useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData, TextInputProps } from 'react-native';

import { emptyFn, EmptyFn, EventFn } from '../config/general';
import { isDefined } from '../utils/is-defined';

const DEFAULT_MIN_VALUE = new BigNumber(0);
const DEFAULT_MAX_VALUE = new BigNumber(Number.MAX_SAFE_INTEGER);

export const useNumericInput = (
  value: BigNumber | undefined,
  decimals: number,
  onBlur: EmptyFn = emptyFn,
  onFocus: TextInputProps['onFocus'] = emptyFn,
  onChange: EventFn<BigNumber | undefined>
) => {
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

    if (newValue.gte(DEFAULT_MIN_VALUE) && newValue.lte(DEFAULT_MAX_VALUE)) {
      setStringValue(normalizedStringValue);
      onChange(normalizedStringValue !== '' ? newValue : undefined);
    }
  };

  const handleFocus = (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    onFocus(evt);
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur();
  };

  const updateValue = () => {
    handleChange(stringValue);
  };

  return { stringValue, handleBlur, handleFocus, handleChange, updateValue };
};
