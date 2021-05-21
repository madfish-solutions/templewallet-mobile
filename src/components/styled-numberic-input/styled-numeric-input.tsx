import { inRange } from 'lodash';
import React, { FC, useEffect, useState } from 'react';

import { EventFn } from '../../config/general';
import { StyledTextInput, StyledTextInputProps } from '../styled-text-input/styled-text-input';

interface Props extends Pick<StyledTextInputProps, 'isError' | 'onBlur'> {
  value: number;
  min?: number;
  max?: number;
  onChange: EventFn<number>;
}

export const StyledNumericInput: FC<Props> = ({
  value,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  isError,
  onBlur,
  onChange
}) => {
  const [displayedValue, setDisplayedValue] = useState<string>(value.toString());

  const handleChange = (changedValue: string) => {
    const parsedNumber = +changedValue;

    if (!isNaN(parsedNumber) && inRange(parsedNumber, min, max)) {
      const isFloat = changedValue.includes('.');

      setDisplayedValue(isFloat ? changedValue : parsedNumber.toString());
      onChange(parsedNumber);
    }
  };

  useEffect(() => void (value !== parseFloat(displayedValue) && setDisplayedValue(value.toString())), [value]);

  return (
    <StyledTextInput
      value={displayedValue}
      isError={isError}
      keyboardType="numeric"
      onBlur={onBlur}
      onChangeText={handleChange}
    />
  );
};
