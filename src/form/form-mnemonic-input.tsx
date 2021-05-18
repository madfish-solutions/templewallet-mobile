import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledMnemonicInput } from '../components/styled-mnemonic-input/styled-mnemonic-input';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
  isEditable?: boolean;
  isShowGetNew?: boolean;
}

export const FormMnemonicInput: FC<Props> = ({ name, isEditable = true, isShowGetNew = false }) => {
  const [field, meta] = useField<string>(name);
  const isError = hasError(meta);

  return (
    <>
      <StyledMnemonicInput
        value={field.value}
        isError={isError}
        isEditable={isEditable}
        isShowGetNew={isShowGetNew}
        onBlur={field.onBlur(name)}
        onChangeText={field.onChange(name)}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
