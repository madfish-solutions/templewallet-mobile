import { inRange } from 'lodash';
import React, { useCallback } from 'react';
import { TextProps } from 'react-native';

import { StyledTextInput } from '../styled-text-input/styled-text-input';

type Props = TextProps & {
  min?: number;
  max?: number;
  value: number | string;
  multiline?: boolean;
  onChange: (v: number | string) => void;
};

export const StyledNumericInput = ({
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  value,
  onChange,
  ...inputProps
}: Props) => {
  /*
    handleChange description
    * if more then two comma: return prev number value
    * if value ends with comma: return string value
    * if value ends with zero: return string value
    * return number value
   */
  const handleChange = useCallback(
    (changedValue: string) => {
      const isTwoComma = [...changedValue].filter(v => v === ',').length > 1;
      if (isTwoComma) {
        const prevVal = changedValue.substring(0, changedValue.length - 1);
        return parseFloat(prevVal.replace(',', '.'));
      }
      if (changedValue.endsWith(',')) {
        return onChange(changedValue);
      }
      const stringValue = changedValue.substring(0);
      const parsedValue = stringValue.replace(',', '.');
      if (changedValue.endsWith('0')) {
        return onChange(parsedValue);
      }
      const parsedInt = parseFloat(parsedValue);
      const intValue = isNaN(parsedInt) ? min : parsedInt;
      inRange(intValue, min, max) && onChange(intValue);
    },
    [min, max, onChange]
  );
  // Format dot to comma decimal
  const inputValue = `${value}`.replace('.', ',');

  return (
    <StyledTextInput
      {...inputProps}
      {...{ type: 'number', keyboardType: 'numeric' }}
      value={inputValue}
      onChangeText={handleChange}
    />
  );
};
