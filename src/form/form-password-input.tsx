import { useField } from 'formik';
import React, { FC } from 'react';

import { Divider } from '../components/divider/divider';
import { PasswordStrengthIndicator } from '../components/password-strength-indicator/password-strength-indicator';
import { StyledPasswordInput } from '../components/styled-password-input/styled-password-input';
import { StyledPasswordInputProps } from '../components/styled-password-input/styled-password-input.props';
import { formatSize } from '../styles/format-size';
import { hasError } from '../utils/has-error';
import { isDefined } from '../utils/is-defined';
import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<StyledPasswordInputProps, 'testID'> {
  name: string;
  isShowPasswordStrengthIndicator?: boolean;
  error?: string;
}

export const FormPasswordInput: FC<Props> = ({ name, isShowPasswordStrengthIndicator, testID, error }) => {
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
      {isDefined(isShowPasswordStrengthIndicator) && isShowPasswordStrengthIndicator ? (
        <>
          <Divider size={formatSize(16)} />
          <PasswordStrengthIndicator isError={isError} password={field.value} />
          {!isDefined(error) && <Divider size={formatSize(28)} />}
        </>
      ) : (
        <ErrorMessage meta={meta} />
      )}
      {(isDefined(error) || isError) && (
        <ErrorMessage
          meta={{
            ...meta,
            touched: true,
            error
          }}
        />
      )}
    </>
  );
};
