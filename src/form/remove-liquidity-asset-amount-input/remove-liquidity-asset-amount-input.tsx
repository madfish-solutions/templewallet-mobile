import { useField } from 'formik';
import React from 'react';

import { AssetAmountInput, AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { hasError } from '../../utils/has-error';

export const RemoveLiquidityAssetAmountInput = ({ name, label, assetsList, onChangeHandler }) => {
  const [field, meta, helpers] = useField<AssetAmountInterface>(name);
  const isError = hasError(meta);

  return (
    <>
      <AssetAmountInput
        value={field.value}
        label={label}
        assetsList={assetsList}
        onValueChange={onChangeHandler}
        onBlur={() => helpers.setTouched(true)}
      />
    </>
  );
};
