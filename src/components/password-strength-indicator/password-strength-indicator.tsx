import React, { memo, useMemo } from 'react';
import { View } from 'react-native';

import {
  AT_LEAST_ONE_LOWER_CASE_REGX,
  AT_LEAST_ONE_NUMBER_REGX,
  AT_LEAST_ONE_UPPER_CASE_REGX,
  MIN_CHARS_REGX,
  SPECIAL_CHARACTER_REGX
} from '../../config/security';
import { isDefined } from '../../utils/is-defined';

import {
  PasswordStrengthIndicatorItem,
  PasswordStrengthIndicatorItemProps
} from './password-strength-indicator-item/password-strength-indicator-item';
import { usePasswordStrengthIndicatorStyles } from './styles';

interface PasswordStrengthIndicatorProps {
  password: string;
  isError?: boolean;
}

const validationRules: Array<Omit<PasswordStrengthIndicatorItemProps, 'isValid'> & { rule: RegExp }> = [
  {
    rule: MIN_CHARS_REGX,
    message: 'Min. 8 characters'
  },
  {
    rule: AT_LEAST_ONE_NUMBER_REGX,
    message: 'One Number'
  },
  {
    rule: AT_LEAST_ONE_LOWER_CASE_REGX,
    message: 'One lower letter'
  },
  {
    rule: AT_LEAST_ONE_UPPER_CASE_REGX,
    message: 'One Capital letter'
  },
  {
    rule: SPECIAL_CHARACTER_REGX,
    message: 'One special character',
    noColor: true
  }
];

export const PasswordStrengthIndicator = memo<PasswordStrengthIndicatorProps>(({ password, isError = false }) => {
  const styles = usePasswordStrengthIndicatorStyles();

  const validationMessages = useMemo(
    () =>
      validationRules.map(({ rule, ...restProps }) => ({
        ...restProps,
        isValid: rule.test(password)
      })),
    [password]
  );

  return (
    <View style={styles.root}>
      {validationMessages.map(item => (
        <PasswordStrengthIndicatorItem
          key={item.message}
          isValid={item.isValid}
          message={item.message}
          noColor={isDefined(item.noColor) ? item.noColor : !isError}
        />
      ))}
    </View>
  );
});
