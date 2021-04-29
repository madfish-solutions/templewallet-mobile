import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledNumericInput } from '../components/styled-numberic-input/styled-numeric-input';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
  multiline?: boolean;
}

export const FormNumericInput: FC<Props> = ({ name, multiline = false }) => {
  const [field, meta] = useField<number>(name);

  return (
    <>
      <StyledNumericInput
        multiline={multiline}
        value={field.value}
        onBlur={field.onBlur(name)}
        onChange={field.onChange(name)}
        isFormik
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
