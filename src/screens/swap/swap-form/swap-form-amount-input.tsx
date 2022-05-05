import { useField } from 'formik';
import React, { FC } from 'react';

import { AssetAmountInterface } from '../../../components/asset-amount-input/asset-amount-input';
import { AssetAmountInputProps } from '../../../components/asset-amount-input/asset-amount-input.props';
import { emptyFn, EventFn } from '../../../config/general';
import { ErrorMessage } from '../../../form/error-message/error-message';
import { hasError } from '../../../utils/has-error';
import { SwapFormAssetAmountInput } from './swap-form-asset-amount-input';

interface Props
  extends Omit<AssetAmountInputProps, 'value' | 'onValueChange'>,
    Partial<Pick<AssetAmountInputProps, 'onValueChange'>>,
    Pick<AssetAmountInputProps, 'selectionOptions' & 'isSearchable' & 'toUsdToggle'> {
  name: string;
  setSearchValue?: EventFn<string>;
}

export const SwapFormAmountInput: FC<Props> = ({
  name,
  label,
  assetsList,
  frozenBalance,
  editable,
  toUsdToggle = true,
  isSearchable = false,
  selectionOptions = undefined,
  setSearchValue = emptyFn,
  onValueChange = emptyFn
}) => {
  const [field, meta, helpers] = useField<AssetAmountInterface>(name);
  const isError = hasError(meta);

  const handleValueChange: EventFn<AssetAmountInterface, void> = newValue => {
    const isSameValue = JSON.stringify(newValue) === JSON.stringify(field.value);
    if (!isSameValue) {
      onValueChange(newValue);
      helpers.setValue(newValue);
    }
  };

  return (
    <>
      <SwapFormAssetAmountInput
        value={field.value}
        label={label}
        assetsList={assetsList}
        frozenBalance={frozenBalance}
        isError={isError}
        isSearchable={isSearchable}
        editable={editable}
        toUsdToggle={toUsdToggle}
        selectionOptions={selectionOptions}
        setSearchValue={setSearchValue}
        onBlur={() => helpers.setTouched(true)}
        onValueChange={handleValueChange}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
