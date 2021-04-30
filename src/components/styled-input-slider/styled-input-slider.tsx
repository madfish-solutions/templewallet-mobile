import React, { FC } from 'react';

import { EventFn } from '../../config/general';
import { Slider } from '../slider/slider';
import { StyledTextInput } from '../styled-text-input/styled-text-input';

interface Props {
  value: number;
  onChange: EventFn<number>;
}

export const StyledInputSlider: FC<Props> = ({ value, onChange }) => {
  const onTextChange = (v: string) => onChange(parseInt(v, 10) || 0);

  return (
    <>
      {/* TODO: Change to NumericInput */}
      <StyledTextInput onChangeText={onTextChange} value={value.toString()} />
      <Slider value={value} onValueChange={onChange} />
    </>
  );
};
