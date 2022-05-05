import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { AssetAmountInputProps } from '../../../components/asset-amount-input/asset-amount-input.props';
import { useAssetAmountInputStyles } from '../../../components/asset-amount-input/asset-amount-input.styles';
import {
  dollarToTokenAmount,
  tokenToDollarAmount
} from '../../../components/asset-amount-input/asset-amount-input.utils';
import { AssetValueText } from '../../../components/asset-value-text/asset-value-text';
import { Divider } from '../../../components/divider/divider';
import { HideBalance } from '../../../components/hide-balance/hide-balance';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { Label } from '../../../components/label/label';
import { TextSegmentControl } from '../../../components/segmented-control/text-segment-control/text-segment-control';
import {
  renderTokenListItem,
  TokenDropdownItem
} from '../../../components/token-dropdown/token-dropdown-item/token-dropdown-item';
import { tokenEqualityFn } from '../../../components/token-dropdown/token-equality-fn';
import { emptyFn } from '../../../config/general';
import { useNumericInput } from '../../../hooks/use-numeric-input.hook';
import { useExchangeRatesSelector } from '../../../store/currency/currency-selectors';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { emptyToken, TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isDefined } from '../../../utils/is-defined';
import { isCollectible, mutezToTz, tzToMutez } from '../../../utils/tezos.util';
import { SwapFormDropdown, SwapFormDropdownValueComponent } from './swap-form-dropdown';

const TOKEN_INPUT_TYPE_INDEX = 0;

const renderTokenValue: SwapFormDropdownValueComponent<TokenInterface> = ({ value }) => (
  <TokenDropdownItem
    token={value}
    actionIconName={IconNameEnum.TriangleDown}
    isShowBalance={false}
    iconSize={formatSize(32)}
  />
);

export const SwapFormAssetAmountInput: FC<AssetAmountInputProps> = ({
  value,
  label,
  assetsList,
  frozenBalance,
  isError = false,
  toUsdToggle = true,
  editable = true,
  isSearchable = false,
  selectionOptions = undefined,
  setSearchValue = emptyFn,
  onBlur,
  onFocus,
  onValueChange
}) => {
  const styles = useAssetAmountInputStyles();
  const colors = useColors();

  const amountInputRef = useRef<TextInput>(null);

  const [inputTypeIndex, setInputTypeIndex] = useState(0);
  const isTokenInputType = inputTypeIndex === TOKEN_INPUT_TYPE_INDEX;

  const amount = value?.amount ?? new BigNumber(0);
  const isLiquidityProviderToken = isDefined(frozenBalance);

  const exchangeRates = useExchangeRatesSelector();
  const exchangeRate: number | undefined = exchangeRates[getTokenSlug(value.asset)];

  const hasExchangeRate = isDefined(exchangeRate);

  const inputValueRef = useRef<BigNumber>();

  const numericInputValue = useMemo(() => {
    const newNumericInputValue = (() => {
      if (isDefined(value.amount)) {
        if (isTokenInputType) {
          return mutezToTz(value.amount, value.asset.decimals);
        } else {
          if (isDefined(inputValueRef.current)) {
            const currentTokenValue = dollarToTokenAmount(inputValueRef.current, value.asset.decimals, exchangeRate);

            if (currentTokenValue.isEqualTo(value.amount) || isCollectible(value.asset)) {
              return inputValueRef.current;
            }
          }

          return tokenToDollarAmount(value.amount, value.asset.decimals, exchangeRate);
        }
      }

      return undefined;
    })();

    inputValueRef.current = newNumericInputValue;

    return newNumericInputValue;
  }, [value.amount, value.asset.decimals, exchangeRate]);

  const { stringValue, handleBlur, handleFocus, handleChange } = useNumericInput(
    numericInputValue,
    value.asset.decimals,
    newInputValue => (inputValueRef.current = newInputValue),
    onBlur,
    onFocus
  );

  const handleTokenInputTypeChange = (tokenTypeIndex: number) => {
    if (isDefined(amountInputRef.current)) {
      amountInputRef.current.focus();
    }
    setInputTypeIndex(tokenTypeIndex);
  };

  const getDefinedAmount = useCallback(
    (decimals, newExchangeRate) =>
      isDefined(inputValueRef.current)
        ? isTokenInputType
          ? tzToMutez(inputValueRef.current, decimals)
          : dollarToTokenAmount(inputValueRef.current, decimals, newExchangeRate)
        : undefined,
    [isTokenInputType, inputValueRef.current]
  );

  const handleTokenChange = (newAsset?: TokenInterface) => {
    const decimals = newAsset?.decimals ?? 0;
    const asset = newAsset ?? emptyToken;
    const newExchangeRate = exchangeRates[getTokenSlug(asset)];

    onValueChange({
      amount: getDefinedAmount(decimals, newExchangeRate),
      asset
    });
  };

  useEffect(
    () =>
      onValueChange({
        ...value,
        amount: getDefinedAmount(value.asset.decimals, exchangeRate)
      }),
    [value.asset.decimals, exchangeRate, getDefinedAmount]
  );

  useEffect(() => void (!hasExchangeRate && setInputTypeIndex(TOKEN_INPUT_TYPE_INDEX)), [hasExchangeRate]);

  return (
    <>
      <View style={styles.headerContainer}>
        <Label label={label} />
        {toUsdToggle && hasExchangeRate && (
          <TextSegmentControl
            width={formatSize(158)}
            selectedIndex={inputTypeIndex}
            values={['TOKEN', 'USD']}
            onChange={handleTokenInputTypeChange}
          />
        )}
      </View>
      <Divider size={formatSize(8)} />

      <View style={[styles.inputContainer, conditionalStyle(isError, styles.inputContainerError)]}>
        <TextInput
          ref={amountInputRef}
          value={stringValue}
          placeholder="0.00"
          style={conditionalStyle(!editable, styles.disabledInput, styles.numericInput)}
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
        <Divider size={formatSize(8)} />

        <View
          style={[styles.dropdownContainer, conditionalStyle(isLiquidityProviderToken, styles.lpDropdownContainer)]}
        >
          <SwapFormDropdown
            title="Assets"
            value={value.asset}
            list={assetsList}
            autoScroll
            comparator={['address', 'id']}
            isSearchable={isSearchable}
            setSearchValue={setSearchValue}
            equalityFn={tokenEqualityFn}
            renderValue={renderTokenValue}
            renderListItem={renderTokenListItem}
            onValueChange={handleTokenChange}
          />
        </View>
      </View>
      <Divider size={formatSize(8)} />

      <View style={styles.footerContainer}>
        <AssetValueText
          amount={amount.toFixed()}
          asset={value.asset}
          style={styles.equivalentValueText}
          convertToDollar={isTokenInputType}
        />
        <View style={styles.balanceContainer}>
          {isLiquidityProviderToken && (
            <>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceDescription}>Frozen Balance:</Text>
                <Divider size={formatSize(4)} />
                <AssetValueText
                  amount={frozenBalance}
                  asset={value.asset}
                  style={styles.balanceValueText}
                  convertToDollar={!isTokenInputType}
                />
              </View>
              <Divider size={formatSize(8)} />
            </>
          )}
          <View style={styles.balanceRow}>
            <Text style={styles.balanceDescription}>{isLiquidityProviderToken ? 'Total Balance:' : 'Balance:'}</Text>
            <Divider size={formatSize(4)} />
            <HideBalance style={styles.balanceValueText}>
              <AssetValueText
                amount={value.asset.balance}
                asset={value.asset}
                style={styles.balanceValueText}
                convertToDollar={!isTokenInputType}
              />
            </HideBalance>
          </View>
        </View>
      </View>
    </>
  );
};
