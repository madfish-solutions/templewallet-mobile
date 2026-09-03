import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FocusEvent, TextInputProps } from 'react-native';

import { emptyFn } from '../config/general';
import { isDefined } from '../utils/is-defined';

const DEFAULT_MIN_VALUE = 0;

export const useNumericInput = (
  value: BigNumber | undefined,
  decimals: number,
  minValue: BigNumber.Value = DEFAULT_MIN_VALUE,
  maxValue: BigNumber.Value | undefined,
  onChange: SyncFn<BigNumber | undefined>,
  onBlur: EmptyFn = emptyFn,
  onFocus: TextInputProps['onFocus'] = emptyFn,
  refreshValueKey?: unknown
) => {
  const [stringValue, setStringValue] = useState('');
  const [focused, setFocused] = useState(false);
  const previousRefreshValueKeyRef = useRef(refreshValueKey);

  useEffect(() => {
    if (focused) {
      if (!isDefined(value)) {
        setStringValue('');
      }
    } else {
      setStringValue(isDefined(value) ? value.toFixed() : '');
    }
  }, [setStringValue, focused, value]);

  useEffect(() => {
    const refreshValueKeyChanged = !Object.is(previousRefreshValueKeyRef.current, refreshValueKey);
    previousRefreshValueKeyRef.current = refreshValueKey;

    if (focused && refreshValueKeyChanged) {
      setStringValue(isDefined(value) ? value.toFixed() : '');
    }
  }, [focused, refreshValueKey, value]);

  const handleChange = useCallback(
    (newStringValue: string) => {
      let normalizedStringValue = newStringValue.replace(/ /g, '').replace(/,/g, '.');

      const newValue = new BigNumber(normalizedStringValue || 0).decimalPlaces(decimals, BigNumber.ROUND_DOWN);

      const indexOfDot = normalizedStringValue.indexOf('.');
      const decimalsCount = indexOfDot === -1 ? 0 : normalizedStringValue.length - indexOfDot - 1;
      if (decimalsCount > decimals) {
        normalizedStringValue = normalizedStringValue.substring(0, indexOfDot + decimals + 1);
      }

      if (newValue.gte(minValue) && (!isDefined(maxValue) || newValue.lte(maxValue))) {
        setStringValue(normalizedStringValue);
        onChange(normalizedStringValue !== '' ? newValue : undefined);
      }
    },
    [decimals, minValue, maxValue, onChange]
  );

  const handleFocus = useCallback(
    (evt: FocusEvent) => {
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
