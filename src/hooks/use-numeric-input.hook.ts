import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData, TextInputProps } from 'react-native';

import { emptyFn, EmptyFn, EventFn } from '../config/general';
import { isDefined } from '../utils/is-defined';

const DEFAULT_MIN_VALUE = new BigNumber(0);
const DEFAULT_MAX_VALUE = new BigNumber(Number.MAX_SAFE_INTEGER);

export const useNumericInput = (
  value: BigNumber | undefined,
  decimals: number,
  onChange: EventFn<BigNumber | undefined>,
  onBlur: EmptyFn = emptyFn,
  onFocus: TextInputProps['onFocus'] = emptyFn
) => {
  const [stringValue, setStringValue] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (focused) {
      if (!isDefined(value)) {
        setStringValue('');
      }
    } else {
      setStringValue(isDefined(value) ? value.toFixed() : '');
    }
  }, [setStringValue, focused, value]);

  const handleChange = useCallback(
    (newStringValue: string) => {
      let normalizedStringValue = newStringValue.replace(/ /g, '').replace(/,/g, '.');

      if (normalizedStringValue === '.' || normalizedStringValue === '0.') {
        setStringValue(normalizedStringValue);
        onChange(new BigNumber(0));

        return;
      }
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
    },
    [decimals, setStringValue, onChange]
  );

  const handleFocus = useCallback(
    (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      onFocus(evt);
    },
    [setFocused, onFocus]
  );

  const handleBlur = useCallback(() => {
    setFocused(false);
    onBlur();
  }, [setFocused, onBlur]);

  return { stringValue, handleBlur, handleFocus, handleChange };
};
