import { useField } from 'formik';
import React, { FC } from 'react';

import { TokenAmountInput, TokenAmountInputProps } from '../components/token-amount-input/token-amount-input';
import { TokenAmountInputValue } from '../interfaces/token-amount-input-value.interface';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<TokenAmountInputProps, 'defaultValue' | 'title' | 'tokens'> {
  name: string;
}

export const FormTokenAmountInput: FC<Props> = ({ defaultValue, name, title, tokens }) => {
  const [field, meta, helpers] = useField<TokenAmountInputValue>(name);
  const isError = hasError(meta);

  const handleChange = (newValue: TokenAmountInputValue) => {
    helpers.setTouched(true);
    helpers.setValue(newValue);
  };

  return (
    <>
      <TokenAmountInput
        isError={isError}
        defaultValue={defaultValue}
        title={title}
        tokens={tokens}
        value={field.value}
        onBlur={() => helpers.setTouched(true)}
        onChange={handleChange}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
