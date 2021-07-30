import { FieldMetaProps } from 'formik';
import React from 'react';
import { Text } from 'react-native';

import { hasError } from '../../utils/has-error';
import { ErrorMessageStyles } from './error-message.styles';

interface Props<T> {
  meta: FieldMetaProps<T>;
}

export const ErrorMessage = <T extends unknown>({ meta }: Props<T>) => {
  const isError = hasError(meta);
  const error = (meta.touched && meta.error) || ' ';

  return <Text style={[ErrorMessageStyles.root, isError && ErrorMessageStyles.rootVisible]}>{error}</Text>;
};
