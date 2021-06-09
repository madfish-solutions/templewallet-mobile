import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

import { emptyFn, EventFn } from '../../config/general';
import { StyledTextInput, StyledTextInputProps } from '../styled-text-input/styled-text-input';

interface Props extends Pick<StyledTextInputProps, 'isError' | 'onBlur' | 'onFocus' | 'editable'> {
  decimals?: number;
  value?: BigNumber;
  isShowCleanButton?: boolean;
  min?: BigNumber;
  max?: BigNumber;
  onChange?: EventFn<BigNumber | undefined>;
}

const defaultMin = new BigNumber(0);
const defaultMax = new BigNumber(Number.MAX_SAFE_INTEGER);

export const StyledNumericInput: FC<Props> = ({
  decimals = 6,
  editable,
  value,
  isShowCleanButton,
  min = defaultMin,
  max = defaultMax,
  isError,
  onBlur = emptyFn,
  onFocus = emptyFn,
  onChange = emptyFn
}) => {
  const [localValue, setLocalValue] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(
    () => void (!focused && setLocalValue(value === undefined ? '' : new BigNumber(value).toFixed())),
    [setLocalValue, focused, value]
  );

  const handleChange = (rawVal: string) => {
    let val = rawVal.replace(/ /g, '').replace(/,/g, '.');
    const numVal = new BigNumber(val || 0).decimalPlaces(decimals);
    const indexOfDot = val.indexOf('.');
    const decimalsCount = indexOfDot === -1 ? 0 : val.length - indexOfDot - 1;
    if (decimalsCount > decimals) {
      val = val.substring(0, indexOfDot + decimals + 1);
    }

    if (numVal.gte(min) && numVal.lte(max)) {
      setLocalValue(val);
      onChange(val !== '' ? numVal : undefined);
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
      value={localValue}
      isError={isError}
      isShowCleanButton={isShowCleanButton}
      keyboardType="numeric"
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChangeText={handleChange}
    />
  );
};
