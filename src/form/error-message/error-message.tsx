import { FieldMetaProps } from 'formik';
import React from 'react';
import { Text } from 'react-native';

import { hasError } from '../../utils/has-error';

import { useErrorMessageStyles } from './error-message.styles';

interface Props<T> {
  meta: FieldMetaProps<T>;
}

export const ErrorMessage = <T extends unknown>({ meta }: Props<T>) => {
  const isError = hasError(meta);
  const error: string | Record<string, string> = (meta.touched ? meta.error : undefined) ?? {};
  const errorStr = (typeof error === 'string' ? error : error[Object.keys(error)[0]]) || ' ';
  const errorMessageStyles = useErrorMessageStyles();

  return <Text style={[errorMessageStyles.root, isError && errorMessageStyles.rootVisible]}>{errorStr}</Text>;
};
