import React, { FC } from 'react';

import { EventFn } from '../../config/general';
import { Slider } from '../slider/slider';
import { StyledNumericInput } from '../styled-numberic-input/styled-numeric-input';

interface Props {
  value: number;
  onChange: EventFn<number>;
}

export const StyledInputSlider: FC<Props> = ({ value, onChange }) => (
  <>
    <StyledNumericInput value={value} onChange={onChange} />
    <Slider value={value} onValueChange={onChange} />
  </>
);
