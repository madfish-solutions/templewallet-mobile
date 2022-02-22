import React, { FC } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';

import { PasswordValidation } from '../../form/form-password-input';
import { isDefined } from '../../utils/is-defined';
import { PasswordStrengthIndicatorItem } from './password-strength-indicator-item/password-strength-indicator-item';
import { usePasswordStrengthIndicatorStyles } from './password-strength-indicator.styles';

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidation;
  isError?: boolean;
}

interface ValidationMessage {
  isValid: boolean;
  message: string;
  noColor?: boolean;
}

export const PasswordStrengthIndicator: FC<PasswordStrengthIndicatorProps> = ({
  validation: { minChar, cases, number, specialChar },
  isError = false
}) => {
  const styles = usePasswordStrengthIndicatorStyles();

  const validationMessages: ValidationMessage[] = [
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

  const renderItem: ListRenderItem<ValidationMessage> = ({ item }) => (
    <PasswordStrengthIndicatorItem
      isValid={item.isValid}
      message={item.message}
      noColor={isDefined(item.noColor) ? item.noColor : !isError}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList data={validationMessages} renderItem={renderItem} keyExtractor={item => item.message} />
    </View>
  );
};
