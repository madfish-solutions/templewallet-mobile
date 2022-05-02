import { useField } from 'formik';
import React, { FC } from 'react';

import { AssetAmountInput, AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { AssetAmountInputProps } from '../../components/asset-amount-input/asset-amount-input.props';
import { EventFn, emptyFn } from '../../config/general';
import { hasError } from '../../utils/has-error';
import { ErrorMessage } from '../error-message/error-message';

interface Props
  extends Omit<AssetAmountInputProps, 'value' | 'onValueChange'>,
    Partial<Pick<AssetAmountInputProps, 'onValueChange'>> {
  name: string;
  toUsdToggle?: boolean;
  isSearchable?: boolean;
  setSearchValue?: EventFn<string>;
  selectionOptions?:
    | {
        start: number;
        end?: number | undefined;
      }
    | undefined;
}

export const FormAssetAmountInput: FC<Props> = ({
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
      <AssetAmountInput
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
