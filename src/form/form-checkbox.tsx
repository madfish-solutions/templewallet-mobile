import React, { FC } from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useField } from 'formik';

import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
  text: string;
}

export const FormCheckbox: FC<Props> = ({ name, text }) => {
  const [field, meta, helpers] = useField<boolean>(name);

  return (
    <>
      <BouncyCheckbox text={text} isChecked={field.value} onBlur={field.onBlur(name)} onPress={helpers.setValue} />
      <ErrorMessage meta={meta} />
    </>
  );
};
