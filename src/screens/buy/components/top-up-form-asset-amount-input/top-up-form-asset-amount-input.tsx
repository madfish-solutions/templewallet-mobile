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
  description,
  emptyListText,
  assetsList = [],
  singleAsset = false,
  editable,
  isSearchable = false,
  precision,
  testID,
  newValueFn,
  setSearchValue = emptyFn,
  onValueChange = emptyFn,
  onBlur = emptyFn
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

  const handleBlur = useCallback(() => {
    onBlur();
    formikContext.setFieldTouched(name, true);
  }, [formikContext.setFieldTouched]);

  return (
    <TopUpAssetAmountInput
      name={name}
      value={field.value}
      label={label}
      description={description}
      emptyListText={emptyListText}
      assetsList={assetsList}
      singleAsset={singleAsset}
      isError={isError}
      meta={meta}
      isSearchable={isSearchable}
      editable={editable}
      precision={precision}
      setSearchValue={setSearchValue}
      testID={testID}
      newValueFn={newValueFn}
      onBlur={handleBlur}
      onValueChange={handleValueChange}
    />
  );
};
