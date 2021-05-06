import { inRange } from 'lodash';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { EventFn } from '../../config/general';
import { StyledTextInput } from '../styled-text-input/styled-text-input';

interface Props {
  min?: number;
  max?: number;
  value: number;
  onChange: EventFn<number>;
}

export const StyledNumericInput: FC<Props> = ({ min = 0, max = Number.MAX_SAFE_INTEGER, value, onChange }) => {
  const [displayedValue, setDisplayedValue] = useState<string>(value.toString());

  const handleChange = useCallback(
    (changedValue: string) => {
      const parsedNumber = +changedValue;

      if (!isNaN(parsedNumber) && inRange(parsedNumber, min, max)) {
        const isFloat = changedValue.includes('.');

        setDisplayedValue(isFloat ? changedValue : parsedNumber.toString());
        onChange(parsedNumber);
      }
    },
    [min, max, onChange]
  );

  useEffect(() => {
    if (value !== parseFloat(displayedValue)) {
      setDisplayedValue(value.toString());
      console.log('displayed value updated');
    }
  }, [value]);

  return <StyledTextInput keyboardType="numeric" value={displayedValue} onChangeText={handleChange} />;
};
