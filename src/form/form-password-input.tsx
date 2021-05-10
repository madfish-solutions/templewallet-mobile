import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledPasswordInput } from '../components/styled-password-input/styled-password-input';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
}

export const FormPasswordInput: FC<Props> = ({ name }) => {
  const [field, meta] = useField<string>(name);
  const hasError = meta.touched && meta.error !== undefined;

  return (
    <>
      <StyledPasswordInput
        value={field.value}
        isError={hasError}
        isShowCleanButton
        onBlur={field.onBlur(name)}
        onChangeText={field.onChange(name)}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
