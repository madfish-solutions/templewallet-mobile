import React from 'react';

import { Slider } from '../slider/slider';
import { StyledTextInput } from '../styled-text-input/styled-text-input';

type Props = {
  onChange: (v: number) => void;
  value: number;
};

export const StyledInputSlider = ({ value, onChange }: Props) => {
  const onTextChange = (v: string) => {
    onChange(parseInt(v, 10) || 0);
  };

  return (
    <>
      <StyledTextInput onChangeText={onTextChange} value={value.toString()} />
      <Slider value={value} onValueChange={onChange} step={1} minimumValue={0} maximumValue={100} />
    </>
  );
};
