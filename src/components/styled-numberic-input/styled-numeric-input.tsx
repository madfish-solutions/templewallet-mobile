import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

import { EventFn } from '../../config/general';
import { StyledTextInput, StyledTextInputProps } from '../styled-text-input/styled-text-input';

interface Props extends Pick<StyledTextInputProps, 'isError' | 'onBlur' | 'onFocus'> {
  decimals?: number;
  value?: BigNumber;
  isShowCleanButton?: boolean;
  min?: BigNumber | number;
  max?: BigNumber | number;
  onChange?: EventFn<BigNumber | undefined>;
  readOnly?: boolean;
}

const defaultMin = new BigNumber(0);
const defaultMax = new BigNumber(Number.MAX_SAFE_INTEGER);

export const StyledNumericInput: FC<Props> = ({
  decimals = 6,
  value,
  isShowCleanButton,
  min = defaultMin,
  max = defaultMax,
  isError,
  onBlur,
  onFocus,
  onChange,
  readOnly
}) => {
  const valueStr = useMemo(() => (value === undefined ? '' : new BigNumber(value).toFixed()), [value]);

  const [localValue, setLocalValue] = useState(valueStr);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setLocalValue(valueStr);
    }
  }, [setLocalValue, focused, valueStr]);

  const handleChange = useCallback(
    (rawVal: string) => {
      let val = rawVal.replace(/ /g, '').replace(/,/g, '.');
      let numVal = new BigNumber(val || 0);
      const indexOfDot = val.indexOf('.');
      if (indexOfDot !== -1 && val.length - indexOfDot > decimals + 1) {
        val = val.substring(0, indexOfDot + decimals + 1);
        numVal = new BigNumber(val);
      }

      if (!numVal.isNaN() && numVal.isGreaterThanOrEqualTo(min) && numVal.isLessThanOrEqualTo(max)) {
        setLocalValue(val);
        if (onChange) {
          onChange(val !== '' ? numVal : undefined);
        }
      }
    },
    [decimals, setLocalValue, min, max, onChange, readOnly]
  );

  const handleFocus = useCallback(
    (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      if (onFocus) {
        onFocus(evt);
        if (evt.defaultPrevented) {
          return;
        }
      }
    },
    [setFocused, onFocus]
  );

  const handleBlur = useCallback(
    (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      if (onBlur) {
        onBlur(evt);
        if (evt.defaultPrevented) {
          return;
        }
      }
    },
    [setFocused, onBlur]
  );

  return (
    <StyledTextInput
      editable={!readOnly}
      value={localValue}
      isError={isError}
      keyboardType="numeric"
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChangeText={handleChange}
      isShowCleanButton={isShowCleanButton}
    />
  );
};
