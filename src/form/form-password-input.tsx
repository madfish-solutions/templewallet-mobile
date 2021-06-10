import { useField } from 'formik';
import React, { FC } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData, TextInputProps } from 'react-native';

import { StyledPasswordInput } from '../components/styled-password-input/styled-password-input';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<TextInputProps, 'onBlur' | 'onFocus'> {
  name: string;
}

export const FormPasswordInput: FC<Props> = ({ name, onBlur, onFocus }) => {
  const [field, meta] = useField<string>(name);
  const isError = hasError(meta);

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    field.onBlur(name)(e);
    onBlur?.(e);
  };

  return (
    <>
      <StyledPasswordInput
        value={field.value}
        isError={isError}
        isShowCleanButton={true}
        onFocus={onFocus}
        onBlur={handleBlur}
        onChangeText={field.onChange(name)}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
