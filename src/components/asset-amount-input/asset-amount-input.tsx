import { BigNumber } from 'bignumber.js';
import React, { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { useNetworkInfo } from '../../hooks/use-network-info.hook';
import { useNumericInput } from '../../hooks/use-numeric-input.hook';
import { useTokenExchangeRateGetter } from '../../hooks/use-token-exchange-rate-getter.hook';
import { useFiatCurrencySelector, useSelectedRpcUrlSelector } from '../../store/settings/settings-selectors';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { emptyTezosLikeToken, TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { conditionalStyle } from '../../utils/conditional-style';
import { isDefined } from '../../utils/is-defined';
import { getNetworkGasTokenMetadata } from '../../utils/network.utils';
import { isCollectible, mutezToTz, tzToMutez } from '../../utils/tezos.util';
import { AssetValueText } from '../asset-value-text/asset-value-text';
import { Divider } from '../divider/divider';
import { Dropdown, DropdownValueComponent } from '../dropdown/dropdown';
import { HideBalance } from '../hide-balance/hide-balance';
import { IconNameEnum } from '../icon/icon-name.enum';
import { Label } from '../label/label';
import { TextSegmentControl } from '../segmented-control/text-segment-control/text-segment-control';
import { renderTokenListItem, TokenDropdownItem } from '../token-dropdown/token-dropdown-item/token-dropdown-item';
import { tokenEqualityFn } from '../token-dropdown/token-equality-fn';
import { AssetAmountInputProps } from './asset-amount-input.props';
import { useAssetAmountInputStyles } from './asset-amount-input.styles';
import { dollarToTokenAmount, tokenToDollarAmount } from './asset-amount-input.utils';

export interface AssetAmountInterface {
  asset: TokenInterface;
  amount?: BigNumber;
}

const TOKEN_INPUT_TYPE_INDEX = 0;

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

const renderTokenValue: DropdownValueComponent<TokenInterface> = ({ value }) => (
  <TokenDropdownItem
    token={value}
    actionIconName={IconNameEnum.TriangleDown}
    isShowBalance={false}
    iconSize={formatSize(32)}
  />
);

const AssetAmountInputComponent: FC<AssetAmountInputProps> = ({
  value,
  label,
  assetsList,
  frozenBalance,
  isError = false,
  toUsdToggle = true,
  editable = true,
  isSearchable = false,
  selectionOptions = undefined,
  maxButton = false,
  maxEstimation = defaultMaxEstimation,
  setSearchValue = emptyFn,
  onBlur,
  onFocus,
  onValueChange
}) => {
  const styles = useAssetAmountInputStyles();
  const colors = useColors();

  const token = useMemo(
    () => assetsList.find(candidateToken => getTokenSlug(candidateToken) === getTokenSlug(value.asset)),
    [assetsList, value.asset]
  );

  const balance = useMemo(() => token?.balance ?? value.asset.balance, [token, value.asset.balance]);

  const { isTezosNode } = useNetworkInfo();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const gasToken = getNetworkGasTokenMetadata(selectedRpcUrl);

  const amountInputRef = useRef<TextInput>(null);

  const [inputTypeIndex, setInputTypeIndex] = useState(0);
  const isTokenInputType = inputTypeIndex === TOKEN_INPUT_TYPE_INDEX;
  const fiatCurrency = useFiatCurrencySelector();

  const amount = value?.amount ?? new BigNumber(0);
  const isLiquidityProviderToken = isDefined(frozenBalance);

  const getTokenExchangeRate = useTokenExchangeRateGetter();
  const hasExchangeRate = isDefined(value.asset.exchangeRate);
  const exchangeRate = value.asset.exchangeRate ?? 1;

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
  }, [value.amount, isTokenInputType, value.asset.decimals, exchangeRate]);

  const onChange = useCallback(
    newInputValue => {
      inputValueRef.current = newInputValue;

      onValueChange({
        ...value,
        amount: getDefinedAmount(newInputValue, value.asset.decimals, exchangeRate, isTokenInputType)
      });
    },
    [value, onValueChange, isTokenInputType]
  );

  const { stringValue, handleBlur, handleFocus, handleChange } = useNumericInput(
    numericInputValue,
    value.asset.decimals,
    onChange,
    onBlur,
    onFocus
  );

  const handleTokenInputTypeChange = (tokenTypeIndex: number) => {
    if (isDefined(amountInputRef.current)) {
      amountInputRef.current.focus();
    }
    setInputTypeIndex(tokenTypeIndex);

    onValueChange({
      ...value,
      amount: getDefinedAmount(
        inputValueRef.current,
        value.asset.decimals,
        exchangeRate,
        tokenTypeIndex === TOKEN_INPUT_TYPE_INDEX
      )
    });
  };

  const handleTokenChange = useCallback(
    (newAsset?: TokenInterface) => {
      const decimals = newAsset?.decimals ?? 0;
      const asset = newAsset ?? emptyTezosLikeToken;
      const newExchangeRate = getTokenExchangeRate(getTokenSlug(asset));

      onValueChange({
        amount: getDefinedAmount(inputValueRef.current, decimals, newExchangeRate ?? 1, isTokenInputType),
        asset
      });
    },
    [onValueChange, isTokenInputType, getTokenExchangeRate]
  );

  const handleMaxButtonPress = useCallback(
    (gasToken: TokenMetadataInterface, token: TokenInterface | undefined) => {
      if (isDefined(token)) {
        maxEstimation(gasToken, token).then(amount =>
          onValueChange({
            amount,
            asset: token
          })
        );
      }
    },
    [onValueChange, maxEstimation]
  );

  useEffect(() => void (!hasExchangeRate && setInputTypeIndex(TOKEN_INPUT_TYPE_INDEX)), [hasExchangeRate]);

  return (
    <>
      <View style={styles.headerContainer}>
        <Label label={label} />
        {isTezosNode && toUsdToggle && hasExchangeRate && (
          <TextSegmentControl
            width={formatSize(158)}
            selectedIndex={inputTypeIndex}
            values={['TOKEN', fiatCurrency]}
            onChange={handleTokenInputTypeChange}
          />
        )}
      </View>
      <Divider size={formatSize(8)} />

      <View style={[styles.inputContainer, conditionalStyle(isError, styles.inputContainerError)]}>
        <View style={[styles.inputPadding, conditionalStyle(!editable, styles.disabledPadding)]} />
        <TextInput
          ref={amountInputRef}
          value={stringValue}
          placeholder="0.00"
          style={[styles.numericInput, conditionalStyle(!editable, styles.disabledInput)]}
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
          <Dropdown
            title="Assets"
            value={value.asset}
            list={assetsList}
            isSearchable={isSearchable}
            setSearchValue={setSearchValue}
            equalityFn={tokenEqualityFn}
            renderValue={renderTokenValue}
            renderListItem={renderTokenListItem}
            keyExtractor={getTokenSlug}
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
                amount={balance}
                asset={value.asset}
                style={styles.balanceValueText}
                convertToDollar={!isTokenInputType}
              />
            </HideBalance>
            {maxButton && (
              <>
                <Divider size={formatSize(8)} />
                <TouchableOpacity
                  hitSlop={{ top: formatSize(8), left: formatSize(8), right: formatSize(8), bottom: formatSize(8) }}
                  onPress={() => handleMaxButtonPress(gasToken, token)}
                >
                  <Text style={styles.maxButtonText}>MAX</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export const AssetAmountInput = memo(AssetAmountInputComponent) as typeof AssetAmountInputComponent;

const defaultMaxEstimation = async (gasToken: TokenMetadataInterface, token: TokenInterface): Promise<BigNumber> => {
  const { symbol, balance } = token;
  const isGasTokenMaxAmountGuard = symbol === gasToken.symbol ? tzToMutez(new BigNumber(0.3), token.decimals) : 0;
  const amount = BigNumber.maximum(new BigNumber(balance).minus(isGasTokenMaxAmountGuard), 0);

  return amount;
};
