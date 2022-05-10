import { useField, useFormikContext } from 'formik';
import React, { FC, useCallback } from 'react';

import { AssetAmountInput, AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { AssetAmountInputProps } from '../../components/asset-amount-input/asset-amount-input.props';
import { emptyFn, EventFn } from '../../config/general';
import { hasError } from '../../utils/has-error';
import { ErrorMessage } from '../error-message/error-message';

interface Props
  extends Omit<AssetAmountInputProps, 'value' | 'onValueChange'>,
    Partial<Pick<AssetAmountInputProps, 'onValueChange'>>,
    Pick<AssetAmountInputProps, 'selectionOptions' & 'isSearchable' & 'toUsdToggle'> {
  name: string;
  setSearchValue?: EventFn<string>;
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
  const formikContext = useFormikContext();
  const [field, meta] = useField<AssetAmountInterface>(name);
  const isError = hasError(meta);

  const handleValueChange: EventFn<AssetAmountInterface, void> = useCallback(
    newValue => {
      onValueChange(newValue);
      formikContext.setFieldValue(name, newValue);
    },
    [onValueChange, formikContext.setFieldValue, name]
  );

  const handleBlur = useCallback(() => formikContext.setFieldTouched(name, true), [formikContext.setFieldTouched]);

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
        onBlur={handleBlur}
        onValueChange={handleValueChange}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
