import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { useNumericInput } from '../../hooks/use-numeric-input.hook';
import { useExchangeRatesSelector } from '../../store/currency/currency-selectors';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { conditionalStyle } from '../../utils/conditional-style';
import { isDefined } from '../../utils/is-defined';
import { mutezToTz, tzToMutez } from '../../utils/tezos.util';
import { AssetValueText } from '../asset-value-text/asset-value-text';
import { Divider } from '../divider/divider';
import { Dropdown, DropdownValueComponent } from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';
import { Label } from '../label/label';
import { TextSegmentControl } from '../segmented-control/text-segment-control/text-segment-control';
import { renderTokenListItem, TokenDropdownItem } from '../token-dropdown/token-dropdown-item/token-dropdown-item';
import { tokenEqualityFn } from '../token-dropdown/token-equality-fn';
import { AssetAmountInputProps } from './asset-amount-input.props';
import { useAssetAmountInputStyles } from './asset-amount-input.styles';

export interface AssetAmountInterface {
  asset: TokenInterface;
  amount?: BigNumber;
}

const TOKEN_INPUT_TYPE_INDEX = 0;

const renderTokenValue: DropdownValueComponent<TokenInterface> = ({ value, disabled }) => (
  <TokenDropdownItem
    token={value}
    actionIconName={IconNameEnum.TriangleDown}
    isShowBalance={false}
    disabled={disabled}
    iconSize={formatSize(32)}
  />
);

export const AssetAmountInput: FC<AssetAmountInputProps> = ({
  value,
  label,
  assetsList,
  frozenBalance,
  isError = false,
  onBlur,
  onFocus,
  onValueChange
}) => {
  const amountInputRef = useRef<TextInput>(null);
  const styles = useAssetAmountInputStyles();
  const colors = useColors();

  const [inputValue, setInputValue] = useState<BigNumber>();
  const [inputTypeIndex, setInputTypeIndex] = useState(0);
  const isTokenInputType = inputTypeIndex === TOKEN_INPUT_TYPE_INDEX;

  const asset = value.asset;
  const amount = value?.amount ?? new BigNumber(0);
  const isLiquidityProviderToken = isDefined(frozenBalance);
  const isDropdownDisabled = assetsList.length === 1;

  const exchangeRates = useExchangeRatesSelector();
  const exchangeRate: number | undefined = exchangeRates[getTokenSlug(asset)];
  const hasExchangeRate = isDefined(exchangeRate);

  const { stringValue, handleBlur, handleFocus, handleChange } = useNumericInput(
    isDefined(value.amount)
      ? mutezToTz(isTokenInputType ? value.amount : value.amount.times(exchangeRate), value.asset.decimals)
      : undefined,
    asset.decimals,
    onBlur,
    onFocus,
    newAmount => setInputValue(newAmount)
  );

  const handleTokenInputTypeChange = (tokenTypeIndex: number) => {
    if (isDefined(amountInputRef.current)) {
      amountInputRef.current.focus();
    }
    setInputTypeIndex(tokenTypeIndex);
  };

  useEffect(
    () =>
      void onValueChange({
        ...value,
        amount: isDefined(inputValue)
          ? isTokenInputType
            ? tzToMutez(inputValue, value.asset.decimals)
            : tzToMutez(inputValue, value.asset.decimals).dividedBy(exchangeRate)
          : undefined
      }),
    [inputValue, asset, isTokenInputType, exchangeRate]
  );
  useEffect(() => void (!hasExchangeRate && setInputTypeIndex(TOKEN_INPUT_TYPE_INDEX)), [hasExchangeRate]);

  return (
    <>
      <View style={styles.headerContainer}>
        <Label label={label} />
        {hasExchangeRate && (
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
          value={stringValue}
          placeholder="0.00"
          style={styles.numericInput}
          placeholderTextColor={colors.gray3}
          selectionColor={colors.orange}
          autoCapitalize="words"
          keyboardType="numeric"
          ref={amountInputRef}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChangeText={handleChange}
        />
        <Divider size={formatSize(8)} />

        <View
          style={[styles.dropdownContainer, conditionalStyle(isLiquidityProviderToken, styles.lpDropdownContainer)]}
        >
          <Dropdown
            title="Assets"
            value={value.asset}
            list={assetsList}
            equalityFn={tokenEqualityFn}
            renderValue={renderTokenValue}
            renderListItem={renderTokenListItem}
            disabled={isDropdownDisabled}
            onValueChange={newAsset => onValueChange({ ...value, asset: newAsset ?? emptyToken })}
          />
        </View>
      </View>
      <Divider size={formatSize(8)} />

      <View style={styles.footerContainer}>
        <AssetValueText
          amount={amount.toFixed()}
          asset={asset}
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
                  asset={asset}
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
            <AssetValueText
              amount={asset.balance}
              asset={asset}
              style={styles.balanceValueText}
              convertToDollar={!isTokenInputType}
            />
          </View>
        </View>
      </View>
    </>
  );
};
