import { useField, useFormikContext } from 'formik';
import React, { memo, useCallback, useMemo } from 'react';

import {
  AssetAmountInput,
  AssetAmountInputV2,
  AssetAmountInterface
} from 'src/components/asset-amount-input/asset-amount-input';
import { AssetAmountInputProps } from 'src/components/asset-amount-input/asset-amount-input.props';
import { AssetAmountInputVariant } from 'src/components/asset-amount-input/asset-amount-input.variants';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { useAssetExchangeRate } from 'src/store/settings/settings-selectors';
import { useAssetBalanceSelector } from 'src/store/wallet/wallet-selectors';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getAssetStoreKey } from 'src/utils/asset.utils';
import { hasError } from 'src/utils/has-error';
import { useDidUpdate } from 'src/utils/hooks';

import { ErrorMessage } from '../error-message/error-message';

interface Props<TAsset extends AssetInterface = TokenInterface>
  extends Omit<AssetAmountInputProps<TAsset>, 'value' | 'onValueChange'> {
  name: string;
  variant?: AssetAmountInputVariant;
  showErrorInFooter?: boolean;
  /** Return false to prevent the default Formik value update. */
  onValueChange?: (value: AssetAmountInterface<TAsset>) => boolean | void;
}

type FormAssetAmountInputComponent = <TAsset extends AssetInterface = TokenInterface>(
  props: Props<TAsset>
) => React.JSX.Element;

export const FormAssetAmountInput = memo<Props<AssetInterface>>(
  ({
    name,
    variant,
    label,
    assetsList,
    frozenBalance,
    editable,
    stylesConfig,
    toUsdToggle = true,
    isLoading = false,
    isSearchable = false,
    searchPlaceholder,
    dropdownListHeader,
    dropdownDescription,
    scrollToSelectedOnOpen,
    isSingleAsset,
    selectionOptions = undefined,
    maxButton = false,
    showErrorInFooter = false,
    expectedGasExpense,
    maxAmount,
    maxButtonDisabled,
    setSearchValue,
    onValueChange,
    testID,
    tokenTestID,
    switcherTestID,
    maxButtonTestID
  }) => {
    const formikContext = useFormikContext();
    const [field, meta, helpers] = useField<AssetAmountInterface<AssetInterface>>(name);
    const isError = hasError(meta);
    const error = meta.touched ? meta.error : undefined;
    const errorMessage = typeof error === 'string' ? error : error?.[Object.keys(error)[0]];

    const handleValueChange: SyncFn<AssetAmountInterface<AssetInterface>, void> = useCallback(
      newValue => {
        const shouldUpdateFormValue = onValueChange?.(newValue) !== false;

        if (shouldUpdateFormValue) {
          formikContext.setFieldValue(name, newValue);
        }
      },
      [onValueChange, formikContext.setFieldValue, name]
    );

    const handleBlur = useCallback(() => formikContext.setFieldTouched(name, true), [formikContext.setFieldTouched]);

    const slug = useMemo(() => getAssetStoreKey(field.value.asset), [field.value.asset]);
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

    const AssetAmountInputComponent = variant === 'v2' ? AssetAmountInputV2 : AssetAmountInput;

    return (
      <>
        <AssetAmountInputComponent
          value={field.value}
          label={label}
          assetsList={assetsList}
          frozenBalance={frozenBalance}
          stylesConfig={stylesConfig}
          isError={isError}
          footerErrorMessage={showErrorInFooter && isError ? errorMessage : undefined}
          isLoading={isLoading}
          isSearchable={isSearchable}
          searchPlaceholder={searchPlaceholder}
          dropdownListHeader={dropdownListHeader}
          dropdownDescription={dropdownDescription}
          scrollToSelectedOnOpen={scrollToSelectedOnOpen}
          isSingleAsset={isSingleAsset}
          editable={editable}
          toUsdToggle={toUsdToggle}
          selectionOptions={selectionOptions}
          maxButton={maxButton}
          setSearchValue={setSearchValue}
          expectedGasExpense={expectedGasExpense}
          maxAmount={maxAmount}
          maxButtonDisabled={maxButtonDisabled}
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
) as FormAssetAmountInputComponent;
