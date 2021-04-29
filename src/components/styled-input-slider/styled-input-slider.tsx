import React, { FC, useCallback, useState } from 'react';
import { TextInputProps } from 'react-native';

import { Slider } from '../slider/slider';
import { StyledTextInput } from '../styled-text-input/styled-text-input';

export const StyledInputSlider: FC<Omit<TextInputProps, 'style'>> = ({ onChangeText, ...props }) => {
  // TODO: replace with NumberInput
  const [value, setValue] = useState(0);

  const onTextChange = useCallback((v: string) => {
    setValue(parseInt(v, 10) || 0);
    onChangeText && onChangeText({ target: { value: v } } as any);
  }, []);

  const onSliderChange = (v: number) => {
    setValue(v);
    onChangeText && onChangeText(v.toString());
  };

  return (
    <>
      <StyledTextInput {...props} onChangeText={onTextChange} value={value.toString()} />
      <Slider value={value || 0} onValueChange={onSliderChange} step={1} minimumValue={0} maximumValue={100} />
    </>
  );
};
