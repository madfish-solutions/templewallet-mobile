import { useField, useFormikContext } from 'formik';
import React, { memo, useCallback, useMemo } from 'react';

import { AssetAmountInput, AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { AssetAmountInputProps } from 'src/components/asset-amount-input/asset-amount-input.props';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useAssetExchangeRate } from 'src/store/settings/settings-selectors';
import { useAssetBalanceSelector } from 'src/store/wallet/wallet-selectors';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { hasError } from 'src/utils/has-error';
import { useDidUpdate } from 'src/utils/hooks';

import { ErrorMessage } from '../error-message/error-message';

interface Props
  extends Omit<AssetAmountInputProps, 'value' | 'onValueChange'>,
    Partial<Pick<AssetAmountInputProps, 'onValueChange'>>,
    Pick<AssetAmountInputProps, 'selectionOptions' & 'isSearchable' & 'toUsdToggle'>,
    TestIdProps {
  name: string;
  setSearchValue?: SyncFn<string>;
}

export const FormAssetAmountInput = memo<Props>(
  ({
    name,
    label,
    assetsList,
    frozenBalance,
    editable,
    stylesConfig,
    toUsdToggle = true,
    isLoading = false,
    isSearchable = false,
    isSingleAsset,
    selectionOptions = undefined,
    maxButton = false,
    expectedGasExpense,
    setSearchValue,
    onValueChange,
    testID,
    tokenTestID,
    switcherTestID,
    maxButtonTestID,
    assetOptionTestIdPropertiesFn
  }) => {
    const formikContext = useFormikContext();
    const [field, meta, helpers] = useField<AssetAmountInterface>(name);
    const isError = hasError(meta);

    const handleValueChange: SyncFn<AssetAmountInterface, void> = useCallback(
      newValue => {
        onValueChange?.(newValue);
        formikContext.setFieldValue(name, newValue);
      },
      [onValueChange, formikContext.setFieldValue, name]
    );

    const handleBlur = useCallback(() => formikContext.setFieldTouched(name, true), [formikContext.setFieldTouched]);

    const slug = useMemo(() => getTokenSlug(field.value.asset), [field.value.asset]);
    const balanceStored = useAssetBalanceSelector(slug);
    const exchangeRateStored = useAssetExchangeRate(slug);

    useDidUpdate(
      () =>
        void helpers.setValue({ ...field.value, asset: { ...field.value.asset, balance: balanceStored ?? '0' } }, true),
      [balanceStored]
    );

    useDidUpdate(
      () =>
        void helpers.setValue(
          { ...field.value, asset: { ...field.value.asset, exchangeRate: exchangeRateStored } },
          true
        ),
      [exchangeRateStored]
    );

    return (
      <>
        <AssetAmountInput
          value={field.value}
          label={label}
          assetsList={assetsList}
          frozenBalance={frozenBalance}
          stylesConfig={stylesConfig}
          isError={isError}
          isLoading={isLoading}
          isSearchable={isSearchable}
          isSingleAsset={isSingleAsset}
          editable={editable}
          toUsdToggle={toUsdToggle}
          selectionOptions={selectionOptions}
          maxButton={maxButton}
          setSearchValue={setSearchValue}
          expectedGasExpense={expectedGasExpense}
          onBlur={handleBlur}
          onValueChange={handleValueChange}
          testID={testID}
          tokenTestID={tokenTestID}
          switcherTestID={switcherTestID}
          maxButtonTestID={maxButtonTestID}
          assetOptionTestIdPropertiesFn={assetOptionTestIdPropertiesFn}
        />
        <ErrorMessage meta={meta} />
      </>
    );
  }
);
