import { useField } from 'formik';
import React, { FC } from 'react';

import { AssetAmountInput, AssetAmountInputProps } from '../components/asset-amount-input/asset-amount-input';
import { AssetAmountInputValue } from '../interfaces/asset-amount-input-value.interface';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<AssetAmountInputProps, 'defaultValue' | 'title' | 'tokens'> {
  name: string;
}

export const FormAssetAmountInput: FC<Props> = ({ defaultValue, name, title, tokens }) => {
  const [field, meta, helpers] = useField<AssetAmountInputValue>(name);
  const isError = hasError(meta);

  const handleChange = (newValue: AssetAmountInputValue) => {
    helpers.setTouched(true);
    helpers.setValue(newValue);
  };

  return (
    <>
      <AssetAmountInput
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
