import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledTextInput } from '../components/styled-text-input/styled-text-input';
import { ErrorMessage } from './error-message/error-message';
import { InputType } from './interfaces/input-type';

interface Props {
  name: string;
  multiline?: boolean;
  type?: InputType;
}

export const FormTextInput: FC<Props> = ({ type = 'text', name, multiline = false }) => {
  const [field, meta] = useField<string>(name);

  return (
    <>
      <StyledTextInput
        secureTextEntry={type === 'password'}
        multiline={multiline}
        value={field.value}
        onBlur={field.onBlur(name)}
        onChangeText={field.onChange(name)}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
