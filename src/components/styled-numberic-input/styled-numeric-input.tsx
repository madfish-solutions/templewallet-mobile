import { inRange } from 'lodash';
import React, { useCallback } from 'react';
import { TextProps } from 'react-native';

import { StyledTextInput } from '../styled-text-input/styled-text-input';

type Props = TextProps & {
  min?: number;
  max?: number;
  value: number;
  multiline?: boolean;
  onChange: (v: number) => void;
};

export const StyledNumericInput = ({
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  value,
  onChange,
  ...inputProps
}: Props) => {
  const handleChange = useCallback(
    (changedValue: string) => {
      const numberValue = changedValue.substring(0);
      const parsedInt = parseFloat(numberValue);
      const intValue = isNaN(parsedInt) ? min : parsedInt;
      inRange(intValue, min, max) && onChange(intValue);
    },
    [min, max, onChange]
  );
  const inputValue = `${value}`;

  return (
    <StyledTextInput
      {...inputProps}
      {...{ type: 'number', keyboardType: 'numeric' }}
      value={inputValue}
      onChangeText={handleChange}
    />
  );
};
