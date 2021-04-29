import React, { useState } from 'react';
import { Text } from 'react-native';

import { Slider } from '../slider/slider';
import { StyledTextInput } from '../styled-text-input/styled-text-input';

export const FeeSlider = () => {
  // TODO: replace with NumberInput
  const [value, setValue] = useState(0);
  return (
    <>
      <Text>Gas Fee</Text>
      <StyledTextInput onChangeText={v => setValue(parseInt(v, 2) || 0)} value={value.toString()} />
      <Slider value={value || 0} onValueChange={setValue} step={50} minimumValue={0} maximumValue={100} />
    </>
  );
};
