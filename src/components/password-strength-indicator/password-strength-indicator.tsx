import React, { FC, Fragment, useMemo } from 'react';

import {
  LETTERS_NUMBERS_MIXTURE_REGX,
  MIN_PASSWORD_LENGTH,
  SPECIAL_CHARACTER_REGX,
  UPPER_CASE_LOWER_CASE_MIXTURE_REGX
} from '../../config/security';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { Divider } from '../divider/divider';

import {
  PasswordStrengthIndicatorItem,
  PasswordStrengthIndicatorItemProps
} from './password-strength-indicator-item/password-strength-indicator-item';

interface PasswordStrengthIndicatorProps {
  password: string;
  isError?: boolean;
}

export const PasswordStrengthIndicator: FC<PasswordStrengthIndicatorProps> = ({ password, isError = false }) => {
  const { minChar, cases, number, specialChar } = useMemo(
    () => ({
      minChar: password.length >= MIN_PASSWORD_LENGTH,
      cases: UPPER_CASE_LOWER_CASE_MIXTURE_REGX.test(password),
      number: LETTERS_NUMBERS_MIXTURE_REGX.test(password),
      specialChar: SPECIAL_CHARACTER_REGX.test(password)
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
        <Fragment key={item.message}>
          <PasswordStrengthIndicatorItem
            isValid={item.isValid}
            message={item.message}
            noColor={isDefined(item.noColor) ? item.noColor : !isError}
          />
          <Divider size={formatSize(4)} />
        </Fragment>
      ))}
    </>
  );
};
