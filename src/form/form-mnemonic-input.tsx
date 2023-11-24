import { useField } from 'formik';
import React, { FC } from 'react';

import { MnemonicInput } from '../components/mnemonic/mnemonic-input/mnemonic-input';
import { MnemonicProps } from '../components/mnemonic/mnemonic.props';
import { TestIdProps } from '../interfaces/test-id.props';
import { hasError } from '../utils/has-error';

import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<MnemonicProps, 'placeholder' | 'testID'>, TestIdProps {
  name: string;
}

export const FormMnemonicInput: FC<Props> = ({ name, placeholder, testID }) => {
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
        testID={testID}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
