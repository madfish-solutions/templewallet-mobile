import React, { FC, useMemo } from 'react';
import { View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { Divider } from '../divider/divider';
import {
  PasswordStrengthIndicatorItem,
  PasswordStrengthIndicatorItemProps
} from './password-strength-indicator-item/password-strength-indicator-item';

const MIN_PASSWORD_LENGTH = 8;
const uppercaseLowercaseMixtureRegx = /(?=.*[a-z])(?=.*[A-Z])/;
const lettersNumbersMixtureRegx = /(?=.*\d)(?=.*[A-Za-z])/;
const specialCharacterRegx = /[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]/;

interface PasswordStrengthIndicatorProps {
  password: string;
  isError?: boolean;
}

export const PasswordStrengthIndicator: FC<PasswordStrengthIndicatorProps> = ({ password, isError = false }) => {
  const { minChar, cases, number, specialChar } = useMemo(
    () => ({
      minChar: password.length >= MIN_PASSWORD_LENGTH,
      cases: uppercaseLowercaseMixtureRegx.test(password),
      number: lettersNumbersMixtureRegx.test(password),
      specialChar: specialCharacterRegx.test(password)
    }),
    [password]
  );

  const validationMessages: PasswordStrengthIndicatorItemProps[] = [
    {
      isValid: minChar,
      message: '✓ At least 8 characters - the more characters, the better'
    },
    {
      isValid: cases,
      message: '✓ Mix of both uppercase and lowercase letters'
    },
    {
      isValid: number,
      message: '✓ Mix of letters and numbers'
    },
    {
      isValid: specialChar,
      message: '✓ Inclusion of at least one special character, e.g., ! @ # ? ] - (optional, recommended).',
      noColor: true
    }
  ];

  return (
    <>
      {validationMessages.map(item => (
        <View key={item.message}>
          <PasswordStrengthIndicatorItem
            isValid={item.isValid}
            message={item.message}
            noColor={isDefined(item.noColor) ? item.noColor : !isError}
          />
          <Divider size={formatSize(4)} />
        </View>
      ))}
    </>
  );
};
