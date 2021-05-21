import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledTextInput } from '../components/styled-text-input/styled-text-input';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
  multiline?: boolean;
  isShowCleanButton?: boolean;
}

export const FormTextInput: FC<Props> = ({ name, multiline = false, isShowCleanButton }) => {
  const [field, meta] = useField<string>(name);
  const isError = hasError(meta);

  return (
    <>
      <StyledTextInput
        multiline={multiline}
        value={field.value}
        isError={isError}
        isShowCleanButton={isShowCleanButton}
        onBlur={field.onBlur(name)}
        onChangeText={field.onChange(name)}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
