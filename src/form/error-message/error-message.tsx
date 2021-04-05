import { Text } from 'react-native';
import React from 'react';

import { ErrorMessageStyles } from './error-message.styles';
import { FieldMetaProps } from 'formik';

interface Props<T> {
  meta: FieldMetaProps<T>;
}

export const ErrorMessage = <T extends unknown>({ meta }: Props<T>) => {
  const hasError = meta.touched && meta.error !== undefined;
  const error = (meta.touched && meta.error) || ' ';

  return <Text style={[ErrorMessageStyles.root, hasError && ErrorMessageStyles.rootVisible]}>{error}</Text>;
};
