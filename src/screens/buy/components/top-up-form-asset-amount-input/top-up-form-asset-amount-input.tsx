import { useField, useFormikContext } from 'formik';
import React, { FC, useCallback } from 'react';

import { emptyFn, EventFn } from '../../../../config/general';
import { hasError } from '../../../../utils/has-error';
import { TopUpAssetAmountInput } from '../top-up-asset-amount-input/top-up-asset-amount-input';
import {
  TopUpAssetAmountInterface,
  TopUpFormAssetAmountInputProps
} from '../top-up-asset-amount-input/top-up-asset-amount-input.props';

export const TopUpFormAssetAmountInput: FC<TopUpFormAssetAmountInputProps> = ({
  name,
  label,
  assetsList = [],
  editable,
  isSearchable = false,
  setSearchValue = emptyFn,
  onValueChange = emptyFn
}) => {
  const formikContext = useFormikContext();
  const [field, meta] = useField<TopUpAssetAmountInterface>(name);
  const isError = hasError(meta);

  const handleValueChange: EventFn<TopUpAssetAmountInterface, void> = useCallback(
    newValue => {
      onValueChange(newValue);
      formikContext.setFieldValue(name, newValue);
    },
    [onValueChange, formikContext.setFieldValue, name]
  );

  const handleBlur = useCallback(() => formikContext.setFieldTouched(name, true), [formikContext.setFieldTouched]);

  return (
    <TopUpAssetAmountInput
      name={name}
      value={field.value}
      label={label}
      assetsList={assetsList}
      isError={isError}
      meta={meta}
      isSearchable={isSearchable}
      editable={editable}
      setSearchValue={setSearchValue}
      onBlur={handleBlur}
      onValueChange={handleValueChange}
    />
  );
};
