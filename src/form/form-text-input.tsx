import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledTextInput } from '../components/styled-text-input/styled-text-input';
import { ErrorMessage } from './error-message/error-message';
import { InputType } from './interfaces/input-type';

interface Props {
  name: string;
  multiline?: boolean;
  isShowCleanButton?: boolean;
  type?: InputType;
}

export const FormTextInput: FC<Props> = ({ type = 'text', name, multiline = false, isShowCleanButton }) => {
  const [field, meta] = useField<string>(name);
  const hasError = meta.touched && meta.error !== undefined;

  return (
    <>
      <StyledTextInput
        secureTextEntry={type === 'password'}
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
