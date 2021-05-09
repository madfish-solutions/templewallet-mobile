import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledTextInput } from '../components/styled-text-input/styled-text-input';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
  multiline?: boolean;
  isAllowCleanButton?: boolean;
}

export const FormTextInput: FC<Props> = ({ name, multiline = false, isAllowCleanButton }) => {
  const [field, meta] = useField<string>(name);

  return (
    <>
      <StyledTextInput
        multiline={multiline}
        value={field.value}
        isError={!!meta.error}
        onBlur={field.onBlur(name)}
        onChangeText={field.onChange(name)}
        isAllowCleanButton={isAllowCleanButton}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
