import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { usePasswordStrengthIndicatorItemStyles } from './password-strength-indicator-item.styles';

export interface PasswordStrengthIndicatorItemProps {
  isValid: boolean;
  message: string;
  noColor?: boolean;
}

export const PasswordStrengthIndicatorItem = memo<PasswordStrengthIndicatorItemProps>(
  ({ isValid, message, noColor = false }) => {
    const styles = usePasswordStrengthIndicatorItemStyles();
    const status = isValid ? 'valid' : noColor ? 'default' : 'error';

    return (
      <View style={[styles.root, styles[`${status}Root`]]}>
        <Text style={[styles.text, styles[`${status}Text`]]}>{message}</Text>
      </View>
    );
  }
);
