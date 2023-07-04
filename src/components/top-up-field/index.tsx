import { useField, useFormikContext } from 'formik';
import React, { FC, useCallback } from 'react';

import { emptyFn, EventFn } from 'src/config/general';
import { hasError } from 'src/utils/has-error';

import { TopUpAssetAmountInput } from './asset-amount-input';
import type { TopUpAssetAmountInterface, TopUpFormAssetAmountInputProps } from './asset-amount-input/types';

export type { TopUpAssetAmountInterface } from './asset-amount-input/types';

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
  tokenTestID,
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
      tokenTestID={tokenTestID}
      newValueFn={newValueFn}
      onBlur={handleBlur}
      onValueChange={handleValueChange}
    />
  );
};
