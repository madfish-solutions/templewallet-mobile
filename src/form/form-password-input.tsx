import { useField } from 'formik';
import React, { FC, useState } from 'react';

import { PasswordStrengthIndicator } from '../components/password-strength-indicator/password-strength-indicator';
import { StyledPasswordInput } from '../components/styled-password-input/styled-password-input';
import { StyledPasswordInputProps } from '../components/styled-password-input/styled-password-input.props';
import { hasError } from '../utils/has-error';
import { isDefined } from '../utils/is-defined';
import { ErrorMessage } from './error-message/error-message';

const MIN_PASSWORD_LENGTH = 8;
const uppercaseLowercaseMixtureRegx = /(?=.*[a-z])(?=.*[A-Z])/;
const lettersNumbersMixtureRegx = /(?=.*\d)(?=.*[A-Za-z])/;
const specialCharacterRegx = /[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]/;

export interface PasswordValidation {
  minChar: boolean;
  cases: boolean;
  number: boolean;
  specialChar: boolean;
}

interface Props extends Pick<StyledPasswordInputProps, 'testID'> {
  name: string;
  isNewPassword?: boolean;
}

export const FormPasswordInput: FC<Props> = ({ name, isNewPassword, testID }) => {
  const [field, meta, helpers] = useField<string>(name);
  const isError = hasError(meta);

  const [focused, setFocused] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minChar: false,
    cases: false,
    number: false,
    specialChar: false
  });

  const handleChange = (text: string) => {
    helpers.setValue(text);
    setPasswordValidation({
      minChar: text.length >= MIN_PASSWORD_LENGTH,
      cases: uppercaseLowercaseMixtureRegx.test(text),
      number: lettersNumbersMixtureRegx.test(text),
      specialChar: specialCharacterRegx.test(text)
    });
  };

  return (
    <>
      <StyledPasswordInput
        value={field.value}
        isError={isError}
        isShowCleanButton={true}
        autoCapitalize="none"
        onBlur={() => helpers.setTouched(true)}
        onFocus={() => setFocused(true)}
        onChangeText={text => handleChange(text)}
        testID={testID}
      />
      {isDefined(isNewPassword) && isNewPassword ? (
        focused && <PasswordStrengthIndicator isError={isError} validation={passwordValidation} />
      ) : (
        <ErrorMessage meta={meta} />
      )}
    </>
  );
};
