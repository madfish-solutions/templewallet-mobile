import { useField } from 'formik';
import React, { FC } from 'react';

import { AssetAmountInput, AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { AssetAmountInputProps } from '../../components/asset-amount-input/asset-amount-input.props';
import { hasError } from '../../utils/has-error';
import { ErrorMessage } from '../error-message/error-message';

interface Props extends Omit<AssetAmountInputProps, 'value' | 'onValueChange'> {
  name: string;
}

export const SwapAssetAmoutInput: FC<Props> = ({ name, label, assetsList, onChangeHandler, onFocusHandler }) => {
  const [field, meta, helpers] = useField<AssetAmountInterface>(name);
  const isError = hasError(meta);

  const onChangeWrapper = (value: AssetAmountInterface) => {
    onChangeHandler(value, name, helpers);
  };

  return (
    <>
      <AssetAmountInput
        value={field.value}
        label={label}
        assetsList={assetsList}
        isError={isError}
        onFocus={() => onFocusHandler(name)}
        onBlur={() => helpers.setTouched(true)}
        onValueChange={onChangeWrapper}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
