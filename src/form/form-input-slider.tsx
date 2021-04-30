import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledInputSlider } from '../components/styled-input-slider/styled-input-slider';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
}

export const FormInputSlider: FC<Props> = ({ name }) => {
  const [field, meta, helpers] = useField<number>(name);

  return (
    <>
      <StyledInputSlider value={field.value} onChange={helpers.setValue} />
      <ErrorMessage meta={meta} />
    </>
  );
};
