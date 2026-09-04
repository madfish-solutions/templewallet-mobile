import BigNumber from 'bignumber.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { DEFAULT_EXPECTED_GAS_EXPENSE, emptyFn } from 'src/config/general';
import { useNumericInput } from 'src/hooks/use-numeric-input.hook';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { useAssetExchangeRateGetter, useFiatCurrencySelector } from 'src/store/settings/settings-selectors';
import { useCurrentAccountTezosBalance, useTokenBalanceGetter } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { emptyTezosLikeToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import {
  assetsEqualityFn,
  getAssetKey,
  getAssetSlug,
  getAssetStoreKey,
  isCollectibleAsset,
  isShieldedAsset
} from 'src/utils/asset.utils';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';

import { AssetValueText } from '../asset-value-text/asset-value-text';
import { Divider } from '../divider/divider';
import { Dropdown, DropdownListItemComponent, DropdownValueComponent } from '../dropdown/dropdown';
import { HideBalance } from '../hide-balance/hide-balance';
import { IconNameV2Enum } from '../icon-v2/icon-name.enum';
import { Label } from '../label/label';
import { PatchedTextInput } from '../patched-text-input';
import { TextSegmentControl } from '../segmented-control/text-segment-control/text-segment-control';
import { TokenDropdownItem, TokenDropdownItemV2 } from '../token-dropdown/token-dropdown-item/token-dropdown-item';
import { TouchableWithAnalytics } from '../touchable-with-analytics';

import { AssetAmountInputProps, AssetAmountInputStylesConfig } from './asset-amount-input.props';
import { useAssetAmountInputStyles } from './asset-amount-input.styles';
import {
  convertAssetAmountInput,
  dollarToTokenAmount,
  FIAT_AMOUNT_DECIMALS,
  getFiatInputAmount,
  tokenToDollarAmount
} from './asset-amount-input.utils';
import { assetAmountInputVariantConfigs, AssetAmountInputVariant } from './asset-amount-input.variants';
import { AssetAmountInputSelectors } from './selectors';

export interface AssetAmountInterface<TAsset extends AssetInterface = TokenInterface> {
  asset: TAsset;
  amount?: BigNumber;
}

const DEFAULT_BALANCE = '0';

const TOKEN_INPUT_TYPE_INDEX = 0;
const defaultAssetAmountInputStylesConfig: AssetAmountInputStylesConfig = {};

const assetOptionTestIdPropertiesFn = (asset: AssetInterface) => ({
  token: isShieldedAsset(asset) ? 'Shielded TEZ' : asset.symbol
});

const getDefinedAmount = (
  amount: BigNumber | undefined,
  decimals: number,
  exchangeRate: number,
  isTokenInputType: boolean
) =>
  isDefined(amount)
    ? isTokenInputType
      ? tzToMutez(amount, decimals)
      : dollarToTokenAmount(amount, decimals, exchangeRate)
    : undefined;

const AssetAmountInputHOC = (variant: AssetAmountInputVariant) => {
  const AssetAmountInput = <TAsset extends AssetInterface = TokenInterface>({
    value,
    label,
    assetsList,
    balance: balanceFromProps,
    balanceLabel,
    frozenBalance,
    isError = false,
    footerErrorMessage,
    toUsdToggle = true,
    editable = true,
    isLoading = false,
    dropdownListHeader,
    isSearchable = false,
    searchPlaceholder,
    dropdownDescription = 'Assets',
    scrollToSelectedOnOpen = true,
    selectionOptions = undefined,
    maxButton = false,
    expectedGasExpense = DEFAULT_EXPECTED_GAS_EXPENSE,
    maxAmount,
    maxButtonDisabled = false,
    stylesConfig = defaultAssetAmountInputStylesConfig,
    isShowNameForValue = true,
    isSingleAsset = false,
    setSearchValue = emptyFn,
    onBlur,
    onFocus,
    onValueChange,
    testID,
    tokenTestID,
    switcherTestID,
    maxButtonTestID
  }: AssetAmountInputProps<TAsset>) => {
    const styles = useAssetAmountInputStyles();
    const variantConfig = assetAmountInputVariantConfigs[variant];
    const { inputHeight, dropdownVerticalPadding, selectedTokenDropdownWidth } = variantConfig;
    const {
      balanceText: configBalanceTextStyles,
      amountInput: configAmountInputStyles,
      inputContainer: configInputContainerStyles
    } = stylesConfig;
    const colors = useColors();
    const { trackEvent } = useAnalytics();
    const getTokenBalance = useTokenBalanceGetter();
    const tezosBalance = useCurrentAccountTezosBalance();

    const configInputPaddingStyles = useMemo(
      () => ({
        backgroundColor: configAmountInputStyles?.backgroundColor
      }),
      [configAmountInputStyles]
    );

    const slug = useMemo(() => getAssetStoreKey(value.asset), [value.asset]);
    const token = useMemo(
      () => assetsList.find(asset => getAssetKey(asset) === getAssetKey(value.asset)) ?? value.asset,
      [assetsList, value.asset]
    );

    const balance = useMemo(() => {
      if (isDefined(balanceFromProps)) {
        return balanceFromProps;
      }

      if (assetsEqualityFn(value.asset, emptyTezosLikeToken)) {
        return DEFAULT_BALANCE;
      }

      return slug === TEZ_TOKEN_SLUG ? tezosBalance : getTokenBalance(slug) ?? value.asset.balance ?? '0';
    }, [getTokenBalance, slug, tezosBalance, value.asset, balanceFromProps]);

    const amountInputRef = useRef<TextInput>(null);
    const renderTokenListItem = useCallback<DropdownListItemComponent<AssetInterface>>(
      ({ item }) => (variant === 'v1' ? <TokenDropdownItem token={item} /> : <TokenDropdownItemV2 token={item} />),
      []
    );

    const [inputTypeIndex, setInputTypeIndex] = useState(0);
    const isTokenInputType = inputTypeIndex === TOKEN_INPUT_TYPE_INDEX;
    const fiatCurrency = useFiatCurrencySelector();

    const amount = value?.amount ?? new BigNumber(0);
    const isLiquidityProviderToken = isDefined(frozenBalance);

    const getTokenExchangeRate = useAssetExchangeRateGetter();
    const hasExchangeRate = isDefined(value.asset.exchangeRate);
    const exchangeRate = value.asset.exchangeRate ?? 1;

    const inputValueRef = useRef<BigNumber>(undefined);
    const isFiatMinimumDisplayRef = useRef(false);

    const numericInputValue = useMemo(() => {
      const newNumericInputValue = (() => {
        if (isDefined(value.amount)) {
          if (isTokenInputType) {
            return mutezToTz(value.amount, value.asset.decimals);
          } else {
            if (isDefined(inputValueRef.current)) {
              const currentTokenValue = dollarToTokenAmount(inputValueRef.current, value.asset.decimals, exchangeRate);

              if (currentTokenValue.isEqualTo(value.amount) || isCollectibleAsset(value.asset)) {
                return inputValueRef.current;
              }
            }

            return getFiatInputAmount(value.amount, value.asset.decimals, exchangeRate);
          }
        }

        return undefined;
      })();

      inputValueRef.current = newNumericInputValue;

      return newNumericInputValue;
    }, [value.amount, isTokenInputType, value.asset, exchangeRate]);

    const renderTokenValue = useCallback<DropdownValueComponent<AssetInterface>>(
      ({ value: tokenValue }) =>
        variant === 'v1' ? (
          <TokenDropdownItem token={tokenValue} isShowBalance={false} isShowName={isShowNameForValue} />
        ) : (
          <TokenDropdownItemV2
            token={tokenValue}
            actionIconName={isSingleAsset ? undefined : IconNameV2Enum.DropdownDown}
            isShowBalance={false}
            isShowName={isShowNameForValue}
          />
        ),
      [isShowNameForValue, isSingleAsset]
    );

    const onChange = useCallback(
      (newInputValue: BigNumber | undefined) => {
        inputValueRef.current = newInputValue;
        isFiatMinimumDisplayRef.current = false;

        onValueChange({
          ...value,
          amount: getDefinedAmount(newInputValue, value.asset.decimals, exchangeRate, isTokenInputType)
        });
      },
      [value, onValueChange, isTokenInputType, exchangeRate]
    );

    const { stringValue, handleBlur, handleFocus, handleChange } = useNumericInput(
      numericInputValue,
      isTokenInputType ? value.asset.decimals : FIAT_AMOUNT_DECIMALS,
      undefined,
      undefined,
      onChange,
      onBlur,
      onFocus,
      inputTypeIndex
    );

    const handleTokenInputTypeChange = (tokenTypeIndex: number) => {
      if (isDefined(amountInputRef.current)) {
        amountInputRef.current.focus();
      }
      const nextIsTokenInputType = tokenTypeIndex === TOKEN_INPUT_TYPE_INDEX;
      const currentTokenAmount = inputValueRef.current;
      const fiatAmount = currentTokenAmount
        ? tokenToDollarAmount(
            tzToMutez(currentTokenAmount, value.asset.decimals),
            value.asset.decimals,
            exchangeRate,
            FIAT_AMOUNT_DECIMALS
          )
        : undefined;
      const shouldPreserveAmount =
        (nextIsTokenInputType && isFiatMinimumDisplayRef.current) ||
        (!nextIsTokenInputType && currentTokenAmount?.isGreaterThan(0) && fiatAmount?.isZero());
      const nextInputValue =
        shouldPreserveAmount && nextIsTokenInputType
          ? mutezToTz(value.amount ?? new BigNumber(0), value.asset.decimals)
          : convertAssetAmountInput(currentTokenAmount, value.asset.decimals, exchangeRate, nextIsTokenInputType);

      inputValueRef.current = nextInputValue;
      isFiatMinimumDisplayRef.current = !nextIsTokenInputType && Boolean(shouldPreserveAmount);
      setInputTypeIndex(tokenTypeIndex);
      trackEvent(switcherTestID, AnalyticsEventCategory.General, { tokenTypeIndex });

      onValueChange({
        ...value,
        amount: shouldPreserveAmount
          ? value.amount
          : getDefinedAmount(nextInputValue, value.asset.decimals, exchangeRate, nextIsTokenInputType)
      });
    };

    const handleTokenChange = useCallback(
      (newAsset?: TAsset) => {
        if (!isDefined(newAsset)) {
          return;
        }

        const { decimals, exchangeRate: assetExchangeRate } = newAsset;
        const asset = newAsset;
        const newExchangeRate = assetExchangeRate ?? getTokenExchangeRate(getAssetStoreKey(asset));

        trackEvent(tokenTestID, AnalyticsEventCategory.ButtonPress, {
          token: isShieldedAsset(asset) ? 'Shielded TEZ' : asset.symbol
        });

        onValueChange({
          amount: getDefinedAmount(inputValueRef.current, decimals, newExchangeRate ?? 1, isTokenInputType),
          asset
        });
      },
      [onValueChange, isTokenInputType, getTokenExchangeRate]
    );

    const handleMaxButtonPress = useCallback(() => {
      if (isDefined(token)) {
        const { balance } = token;
        const isGasToken = getAssetSlug(token) === TEZ_TOKEN_SLUG;
        const isGasTokenMaxAmountGuard = isGasToken ? tzToMutez(new BigNumber(expectedGasExpense), token.decimals) : 0;
        const amount = isDefined(maxAmount)
          ? BigNumber.maximum(new BigNumber(maxAmount), 0)
          : BigNumber.maximum(new BigNumber(balance).minus(isGasTokenMaxAmountGuard), 0);

        amountInputRef.current?.blur();
        trackEvent(maxButtonTestID, AnalyticsEventCategory.ButtonPress);

        onValueChange({
          amount,
          asset: token
        });
      }
    }, [token, onValueChange, amountInputRef, trackEvent, expectedGasExpense, maxAmount, maxButtonTestID]);

    useEffect(() => void (!hasExchangeRate && setInputTypeIndex(TOKEN_INPUT_TYPE_INDEX)), [hasExchangeRate]);

    return (
      <>
        <View style={styles.headerContainer}>
          <Label label={label} />
          {toUsdToggle && hasExchangeRate && (
            <TextSegmentControl
              width={formatSize(128)}
              selectedIndex={inputTypeIndex}
              values={['TOKEN', fiatCurrency]}
              testID={AssetAmountInputSelectors.inputTypeSwitcher}
              onChange={handleTokenInputTypeChange}
            />
          )}
        </View>
        <Divider size={formatSize(8)} />

        <View
          style={[
            styles.inputContainer,
            conditionalStyle(!editable, styles.disabledInputContainer),
            conditionalStyle(isError, styles.inputContainerError),
            { height: inputHeight },
            configInputContainerStyles
          ]}
        >
          <View
            style={[styles.inputPadding, conditionalStyle(!editable, styles.disabledPadding), configInputPaddingStyles]}
          />

          <PatchedTextInput
            ref={amountInputRef}
            value={stringValue}
            placeholder="0.00"
            style={[styles.numericInput, conditionalStyle(!editable, styles.disabledInput), configAmountInputStyles]}
            placeholderTextColor={colors.gray3}
            selectionColor={colors.orange}
            editable={editable}
            selection={selectionOptions}
            autoCapitalize="words"
            keyboardType="numeric"
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChangeText={handleChange}
          />

          <View
            style={[
              styles.dropdownContainer,
              conditionalStyle(isLiquidityProviderToken, styles.lpDropdownContainer),
              conditionalStyle(!editable, styles.disabledDropdownContainer),
              { paddingVertical: dropdownVerticalPadding, width: selectedTokenDropdownWidth }
            ]}
          >
            <Dropdown
              description={dropdownDescription}
              disabled={isSingleAsset}
              value={value.asset}
              list={assetsList}
              isSearchable={isSearchable}
              searchPlaceholder={searchPlaceholder}
              scrollToSelectedOnOpen={scrollToSelectedOnOpen}
              isLoading={isLoading}
              setSearchValue={setSearchValue}
              equalityFn={assetsEqualityFn}
              renderValue={renderTokenValue}
              renderListItem={renderTokenListItem}
              listHeader={dropdownListHeader}
              {...(variant === 'v2' && {
                listItemHeight: formatSize(44),
                listItemSeparatorSize: formatSize(8),
                listItemDividerSize: 0,
                isCompactListItem: true
              })}
              keyExtractor={getAssetKey}
              onValueChange={handleTokenChange}
              testID={testID}
              itemTestIDPropertiesFn={assetOptionTestIdPropertiesFn}
            />
          </View>
        </View>
        <Divider size={formatSize(8)} />

        <View style={styles.footerContainer}>
          {footerErrorMessage ? (
            <Text style={styles.footerErrorText}>{footerErrorMessage}</Text>
          ) : (
            <AssetValueText
              amount={amount.toFixed()}
              asset={value.asset}
              style={styles.equivalentValueText}
              convertToDollar={isTokenInputType}
            />
          )}
          <View style={styles.balanceContainer}>
            {isLiquidityProviderToken && (
              <>
                <View style={styles.balanceRow}>
                  <Text style={styles.balanceText}>Frozen Balance:</Text>
                  <Divider size={formatSize(4)} />
                  <AssetValueText
                    amount={frozenBalance}
                    asset={value.asset}
                    style={[styles.balanceValueText, configBalanceTextStyles]}
                    convertToDollar={!isTokenInputType}
                  />
                </View>
                <Divider size={formatSize(8)} />
              </>
            )}
            <View style={styles.balanceRow}>
              <Text style={styles.balanceText}>
                {balanceLabel ?? (isLiquidityProviderToken ? 'Total Balance:' : 'Balance:')}
              </Text>
              <Divider size={formatSize(4)} />
              <HideBalance textStyle={styles.balanceValueText}>
                <AssetValueText
                  amount={balance}
                  asset={value.asset}
                  style={[styles.balanceValueText, configBalanceTextStyles]}
                  convertToDollar={!isTokenInputType}
                />
              </HideBalance>
              {maxButton && (
                <>
                  <Divider size={formatSize(8)} />
                  <TouchableWithAnalytics
                    hitSlop={{ top: formatSize(8), left: formatSize(8), right: formatSize(8), bottom: formatSize(8) }}
                    onPress={handleMaxButtonPress}
                    disabled={maxButtonDisabled}
                    testID={AssetAmountInputSelectors.maxButton}
                    testIDProperties={{ token: token?.symbol }}
                  >
                    <Text style={styles.maxButtonText}>MAX</Text>
                  </TouchableWithAnalytics>
                </>
              )}
            </View>
          </View>
        </View>
      </>
    );
  };

  return AssetAmountInput;
};

/** @deprecated Use AssetAmountInputV2 instead. */
export const AssetAmountInput = AssetAmountInputHOC('v1');

export const AssetAmountInputV2 = AssetAmountInputHOC('v2');
