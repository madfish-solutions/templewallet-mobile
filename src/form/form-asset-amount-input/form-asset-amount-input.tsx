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
    Pick<
      AssetAmountInputProps,
      | 'selectionOptions'
      | 'isSearchable'
      | 'toUsdToggle'
      | 'inputTypeSwitcherGap'
      | 'inputTypeSwitcherVariant'
      | 'inputTypeSwitcherWidth'
      | 'inputHeight'
      | 'dropdownVerticalPadding'
      | 'dropdownAppearance'
      | 'scrollToSelectedValue'
      | 'spaceBeforeFiatSymbol'
      | 'selectedTokenIconSize'
      | 'selectedTokenIconVisualSize'
      | 'selectedTokenIconGap'
      | 'selectedTokenDropdownWidth'
    >,
    TestIdProps {
  name: string;
  setSearchValue?: SyncFn<string>;
  showErrorInFooter?: boolean;
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
    inputTypeSwitcherGap,
    inputTypeSwitcherVariant,
    inputTypeSwitcherWidth,
    inputHeight,
    dropdownVerticalPadding,
    searchPlaceholder,
    dropdownListHeader,
    dropdownDescription,
    dropdownAppearance,
    scrollToSelectedValue,
    spaceBeforeFiatSymbol,
    isSingleAsset,
    selectionOptions = undefined,
    selectedTokenIconSize,
    selectedTokenIconVisualSize,
    selectedTokenIconGap,
    selectedTokenDropdownWidth,
    maxButton = false,
    showErrorInFooter = false,
    expectedGasExpense,
    setSearchValue,
    onValueChange,
    testID,
    tokenTestID,
    switcherTestID,
    maxButtonTestID
  }) => {
    const formikContext = useFormikContext();
    const [field, meta, helpers] = useField<AssetAmountInterface>(name);
    const isError = hasError(meta);
    const error = meta.touched ? meta.error : undefined;
    const errorMessage = typeof error === 'string' ? error : error?.[Object.keys(error)[0]];

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
        void helpers.setValue(
          {
            ...field.value,
            asset: { ...field.value.asset, balance: balanceStored ?? field.value.asset.balance ?? '0' }
          },
          true
        ),
      [balanceStored]
    );

    useDidUpdate(
      () =>
        void helpers.setValue(
          {
            ...field.value,
            asset: {
              ...field.value.asset,
              exchangeRate: exchangeRateStored ?? field.value.asset.exchangeRate
            }
          },
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
          footerErrorMessage={showErrorInFooter && isError ? errorMessage : undefined}
          isLoading={isLoading}
          inputTypeSwitcherGap={inputTypeSwitcherGap}
          inputTypeSwitcherVariant={inputTypeSwitcherVariant}
          inputTypeSwitcherWidth={inputTypeSwitcherWidth}
          inputHeight={inputHeight}
          dropdownVerticalPadding={dropdownVerticalPadding}
          isSearchable={isSearchable}
          searchPlaceholder={searchPlaceholder}
          dropdownListHeader={dropdownListHeader}
          dropdownDescription={dropdownDescription}
          dropdownAppearance={dropdownAppearance}
          scrollToSelectedValue={scrollToSelectedValue}
          spaceBeforeFiatSymbol={spaceBeforeFiatSymbol}
          isSingleAsset={isSingleAsset}
          editable={editable}
          toUsdToggle={toUsdToggle}
          selectionOptions={selectionOptions}
          selectedTokenIconSize={selectedTokenIconSize}
          selectedTokenIconVisualSize={selectedTokenIconVisualSize}
          selectedTokenIconGap={selectedTokenIconGap}
          selectedTokenDropdownWidth={selectedTokenDropdownWidth}
          maxButton={maxButton}
          setSearchValue={setSearchValue}
          expectedGasExpense={expectedGasExpense}
          onBlur={handleBlur}
          onValueChange={handleValueChange}
          testID={testID}
          tokenTestID={tokenTestID}
          switcherTestID={switcherTestID}
          maxButtonTestID={maxButtonTestID}
        />
        {!showErrorInFooter && <ErrorMessage meta={meta} />}
      </>
    );
  }
);
