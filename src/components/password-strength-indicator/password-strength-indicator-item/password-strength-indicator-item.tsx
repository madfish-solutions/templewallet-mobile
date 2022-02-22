import React, { FC, ReactNode } from 'react';
import { Text } from 'react-native';

import { usePasswordStrengthIndicatorItemStyles } from './password-strength-indicator-item.styles';

interface PasswordStrengthIndicatorItemProps {
  isValid: boolean;
  message: ReactNode;
  noColor?: boolean;
}

export const PasswordStrengthIndicatorItem: FC<PasswordStrengthIndicatorItemProps> = ({
  isValid,
  message,
  noColor = false
}) => {
  const styles = usePasswordStrengthIndicatorItemStyles();
  const validationColor = isValid ? styles.adding : noColor ? undefined : styles.destructive;

  return <Text style={[styles.text, validationColor]}>{message}</Text>;
};
