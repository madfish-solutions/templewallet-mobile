import { useField } from 'formik';
import React, { FC } from 'react';

import { AssetAmountInput, AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { AssetAmountInputProps } from '../../components/asset-amount-input/asset-amount-input.props';
import { hasError } from '../../utils/has-error';
import { ErrorMessage } from '../error-message/error-message';

interface Props extends Omit<AssetAmountInputProps, 'value' | 'onValueChange'> {
  name: string;
}

export const FormAssetAmountInput: FC<Props> = ({ name, label, assetsList, frozenBalance }) => {
  const [field, meta, helpers] = useField<AssetAmountInterface>(name);
  const isError = hasError(meta);

  return (
    <>
      <AssetAmountInput
        value={field.value}
        label={label}
        assetsList={assetsList}
        frozenBalance={frozenBalance}
        isError={isError}
        onBlur={() => helpers.setTouched(true)}
        onValueChange={helpers.setValue}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
