import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledTextInput } from '../components/styled-text-input/styled-text-input';
import { StyledTextInputProps } from '../components/styled-text-input/styled-text-input.props';
import { isAndroid } from '../config/system';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props
  extends Pick<StyledTextInputProps, 'editable' | 'placeholder' | 'isShowCleanButton' | 'autoCapitalize'> {
  name: string;
}

export const FormTextInput: FC<Props> = ({ name, editable, placeholder, isShowCleanButton, autoCapitalize }) => {
  const [field, meta, helpers] = useField<string>(name);
  const isError = hasError(meta);

  return (
    <>
      <StyledTextInput
        autoCorrect={false}
        autoComplete="off"
        spellCheck={false}
        {...(isAndroid ? { keyboardType: 'visible-password' } : {})}
        value={field.value}
        editable={editable}
        placeholder={placeholder}
        isError={isError}
        isShowCleanButton={isShowCleanButton}
        autoCapitalize={autoCapitalize}
        onBlur={() => helpers.setTouched(true)}
        onChangeText={field.onChange(name)}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
