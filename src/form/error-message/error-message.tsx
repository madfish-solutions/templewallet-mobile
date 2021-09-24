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
  const error: string | Record<string, string> = (meta.touched && meta.error) || {};
  const errorStr = (typeof error === 'string' ? error : error[Object.keys(error)[0]]) || ' ';

  return <Text style={[ErrorMessageStyles.root, isError && ErrorMessageStyles.rootVisible]}>{errorStr}</Text>;
};
