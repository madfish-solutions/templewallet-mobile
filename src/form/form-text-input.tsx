import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledTextInput, StyledTextInputProps } from '../components/styled-text-input/styled-text-input';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<StyledTextInputProps, 'editable' | 'placeholder' | 'isShowCleanButton'> {
  name: string;
}

export const FormTextInput: FC<Props> = ({ name, editable, placeholder, isShowCleanButton }) => {
  const [field, meta, helpers] = useField<string>(name);
  const isError = hasError(meta);

  return (
    <>
      <StyledTextInput
        value={field.value}
        editable={editable}
        placeholder={placeholder}
        isError={isError}
        isShowCleanButton={isShowCleanButton}
        onBlur={() => helpers.setTouched(true)}
        onChangeText={field.onChange(name)}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
