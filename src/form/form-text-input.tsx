import React from 'react';

import { StyledTextInput } from '../components/styled-text-input/styled-text-input';
import { FormControlRender } from './form-control-render.type';

export const FormTextInput: FormControlRender<string> = ({ onChange, onBlur, value }) => (
  <StyledTextInput value={value} onBlur={onBlur} onChangeText={newValue => onChange(newValue)} />
);
