import CheckBox from '@react-native-community/checkbox';
import { useField } from 'formik';
import React, { FC } from 'react';

import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
}

export const FormCheckbox: FC<Props> = ({ name }) => {
  const [field, meta, helpers] = useField<boolean>(name);

  return (
    <>
      <CheckBox value={field.value} onValueChange={helpers.setValue} />
      <ErrorMessage meta={meta} />
    </>
  );
};
