import { useField, useFormikContext } from 'formik';
import React, { FC, useCallback } from 'react';

import { emptyFn, EventFn } from '../../../../config/general';
import { ErrorMessage } from '../../../../form/error-message/error-message';
import { hasError } from '../../../../utils/has-error';
import { ExolixAssetAmountInput, ExolixAssetAmountInterface } from './exolix-asset-amount-input';
import { ExolixFormAssetAmountInputProps } from './exolix-form-asset-input.props';

export const ExolixFormAssetAmountInput: FC<ExolixFormAssetAmountInputProps> = ({
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
    <>
      <ExolixAssetAmountInput
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
