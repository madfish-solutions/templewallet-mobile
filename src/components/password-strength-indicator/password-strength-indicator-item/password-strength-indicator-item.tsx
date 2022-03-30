import React, { FC } from 'react';
import { Text } from 'react-native';

import { usePasswordStrengthIndicatorItemStyles } from './password-strength-indicator-item.styles';

export interface PasswordStrengthIndicatorItemProps {
  isValid: boolean;
  message: string;
  noColor?: boolean;
}

export const PasswordStrengthIndicatorItem: FC<PasswordStrengthIndicatorItemProps> = ({
  isValid,
  message,
  noColor = false
}) => {
  const styles = usePasswordStrengthIndicatorItemStyles();
  const errorColor = noColor ? undefined : styles.destructive;
  const validationColor = isValid ? styles.adding : errorColor;

  return <Text style={[styles.text, validationColor]}>{message}</Text>;
};
