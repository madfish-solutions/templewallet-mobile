import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledNumericInput } from '../components/styled-numberic-input/styled-numeric-input';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
}

export const FormNumericInput: FC<Props> = ({ name }) => {
  const [field, meta, helpers] = useField<number>(name);
  const isError = hasError(meta);

  return (
    <>
      <StyledNumericInput
        value={field.value}
        isError={isError}
        onBlur={field.onBlur(name)}
        onChange={helpers.setValue}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
