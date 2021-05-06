import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledNumericInput } from '../components/styled-numberic-input/styled-numeric-input';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
}

export const FormNumericInput: FC<Props> = ({ name }) => {
  const [field, meta, helpers] = useField<number>(name);

  return (
    <>
      <StyledNumericInput value={field.value} onChange={helpers.setValue} />
      <ErrorMessage meta={meta} />
    </>
  );
};
