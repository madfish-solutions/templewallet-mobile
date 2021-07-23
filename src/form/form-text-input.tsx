import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledTextInput, StyledTextInputProps } from '../components/styled-text-input/styled-text-input';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<StyledTextInputProps, 'editable' | 'placeholder' | 'isShowCleanButton' | 'style'> {
  name: string;
  hideError?: boolean;
}

export const FormTextInput: FC<Props> = ({
  name,
  editable,
  hideError = false,
  placeholder,
  isShowCleanButton,
  style
}) => {
  const [field, meta, helpers] = useField<string>(name);
  const isError = hasError(meta);

  return (
    <>
      <StyledTextInput
        value={field.value}
        editable={editable}
        placeholder={placeholder}
        isError={!hideError && isError}
        isShowCleanButton={isShowCleanButton}
        onBlur={() => helpers.setTouched(true)}
        onChangeText={field.onChange(name)}
        style={style}
      />
      {!hideError && <ErrorMessage meta={meta} />}
    </>
  );
};
