import { inRange } from 'lodash';
import React, { ChangeEvent, useCallback } from 'react';
import { TextProps } from 'react-native';

import { StyledTextInput } from '../styled-text-input/styled-text-input';

type Props = TextProps & {
  min?: number;
  max?: number;
  value: number;
  multiline?: boolean;
  onChange: (v: string | ChangeEvent<any>) => void;
  onBlur?: (v: string | ChangeEvent<any>) => void;
  isFormik?: boolean;
};

export const StyledNumericInput = ({
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  value,
  onChange,
  isFormik,
  ...inputProps
}: Props) => {
  const handleChange = useCallback(
    (changedValue: string) => {
      const numberValue = changedValue.substring(0);
      const parsedInt = parseFloat(numberValue);
      const intValue = isNaN(parsedInt) ? min : parsedInt;
      // TODO: refactor onChange && onBlur types
      inRange(intValue, min, max) &&
        onChange((isFormik ? { target: { value: intValue } } : intValue) as ChangeEvent<any>);
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
