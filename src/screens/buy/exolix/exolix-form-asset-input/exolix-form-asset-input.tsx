import { useField, useFormikContext } from 'formik';
import React, { FC, useCallback } from 'react';

import { emptyFn, EventFn } from '../../../../config/general';
import { hasError } from '../../../../utils/has-error';
import { ExolixAssetAmountInput, ExolixAssetAmountInterface } from './exolix-asset-amount-input';
import { ExolixFormAssetAmountInputProps } from './exolix-form-asset-input.props';

export const ExolixFormAssetAmountInput: FC<ExolixFormAssetAmountInputProps> = ({
  name,
  label,
  assetsList,
  editable,
  isSearchable = false,
  setSearchValue = emptyFn,
  onValueChange = emptyFn
}) => {
  const formikContext = useFormikContext();
  const [field, meta] = useField<ExolixAssetAmountInterface>(name);
  const isError = hasError(meta);

  const handleValueChange: EventFn<ExolixAssetAmountInterface, void> = useCallback(
    newValue => {
      onValueChange(newValue);
      formikContext.setFieldValue(name, newValue);
    },
    [onValueChange, formikContext.setFieldValue, name]
  );

  const handleBlur = useCallback(() => formikContext.setFieldTouched(name, true), [formikContext.setFieldTouched]);

  return (
    <ExolixAssetAmountInput
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
