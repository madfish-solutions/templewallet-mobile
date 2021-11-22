import { useField } from 'formik';
import React, { FC } from 'react';

import { MnemonicCreate } from '../components/mnemonic/mnemonic-create/mnemonic-create';
import { TestIdProps } from '../interfaces/test-id.props';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props extends TestIdProps {
  name: string;
}

export const FormMnemonicCreate: FC<Props> = ({ name, testID }) => {
  const [field, meta, helpers] = useField<string>(name);
  const isError = hasError(meta);

  return (
    <>
      <MnemonicCreate
        value={field.value}
        isError={isError}
        onBlur={() => helpers.setTouched(true)}
        onChangeText={field.onChange(name)}
        testID={testID}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
