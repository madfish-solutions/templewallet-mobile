import { useField } from 'formik';
import React, { FC } from 'react';

import { MnemonicInput } from '../components/mnemonic/mnemonic-input/mnemonic-input';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
  placeholder?: string;
}

export const FormMnemonicInput: FC<Props> = ({ name, placeholder }) => {
  const [field, meta, helpers] = useField<string>(name);
  const isError = hasError(meta);

  return (
    <>
      <MnemonicInput
        value={field.value}
        isError={isError}
        placeholder={placeholder}
        onBlur={() => helpers.setTouched(true)}
        onChangeText={field.onChange(name)}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
