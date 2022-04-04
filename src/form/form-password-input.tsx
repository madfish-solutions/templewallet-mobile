import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledPasswordInput } from '../components/styled-password-input/styled-password-input';
import { StyledPasswordInputProps } from '../components/styled-password-input/styled-password-input.props';
import { hasError } from '../utils/has-error';
import { isDefined } from '../utils/is-defined';
import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<StyledPasswordInputProps, 'testID'> {
  name: string;
  error?: string;
}

export const FormPasswordInput: FC<Props> = ({ name, testID, error }) => {
  const [field, meta, helpers] = useField<string>(name);
  const isError = hasError(meta);

  return (
    <>
      <StyledPasswordInput
        value={field.value}
        isError={isError}
        isShowCleanButton={true}
        autoCapitalize="none"
        onBlur={() => helpers.setTouched(true)}
        onChangeText={field.onChange(name)}
        testID={testID}
      />
      <ErrorMessage meta={meta} />
      {isDefined(error) && <ErrorMessage meta={{ value: error, error, touched: true, initialTouched: true }} />}
    </>
  );
};
