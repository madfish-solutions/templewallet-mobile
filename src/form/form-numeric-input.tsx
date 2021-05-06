import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledNumericInput } from '../components/styled-numberic-input/styled-numeric-input';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
  multiline?: boolean;
}

export const FormNumericInput: FC<Props> = ({ name, multiline = false }) => {
  const [field, meta, helpers] = useField<number | string>(name);

  return (
    <>
      <StyledNumericInput multiline={multiline} value={field.value} onChange={helpers.setValue} />
      <ErrorMessage meta={meta} />
    </>
  );
};
