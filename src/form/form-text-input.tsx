import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledTextInput } from '../components/styled-text-input/styled-text-input';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
  multiline?: boolean;
  isShowCleanButton?: boolean;
}

export const FormTextInput: FC<Props> = ({ name, multiline = false, isShowCleanButton }) => {
  const [field, meta] = useField<string>(name);
  const hasError = meta.touched && meta.error !== undefined;

  return (
    <>
      <StyledTextInput
        multiline={multiline}
        value={field.value}
        isError={hasError}
        isShowCleanButton={isShowCleanButton}
        onBlur={field.onBlur(name)}
        onChangeText={field.onChange(name)}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
