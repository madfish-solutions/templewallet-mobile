import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledInputSlider } from '../components/styled-input-slider/styled-input-slider';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
  multiline?: boolean;
}

export const FormInputSlider: FC<Props> = ({ name, multiline = false }) => {
  const [field, meta] = useField<string>(name);

  return (
    <>
      <StyledInputSlider
        multiline={multiline}
        value={field.value}
        onBlur={field.onBlur(name)}
        onChangeText={field.onChange(name)}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
