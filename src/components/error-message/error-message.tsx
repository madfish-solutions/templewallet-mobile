import { Text } from 'react-native';
import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';

import { ErrorMessageStyles } from './error-message.styles';

interface Props {
  fieldError?: FieldError;
}

export const ErrorMessage: FC<Props> = ({ fieldError }) => (
  <Text style={[ErrorMessageStyles.root, fieldError && ErrorMessageStyles.rootVisible]}>
    {fieldError?.message ?? ' '}
  </Text>
);
