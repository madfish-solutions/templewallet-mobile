import { BigNumber } from 'bignumber.js';
import React, { FC, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { useNumericInput } from '../../hooks/use-numeric-input.hook';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { conditionalStyle } from '../../utils/conditional-style';
import { isDefined } from '../../utils/is-defined';
import { tzToMutez } from '../../utils/tezos.util';
import { Divider } from '../divider/divider';
import { DollarValueText } from '../dollar-value-text/dollar-value-text';
import { Dropdown, DropdownValueComponent } from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';
import { Label } from '../label/label';
import { TextSegmentControl } from '../segmented-control/text-segment-control/text-segment-control';
import { renderTokenListItem, TokenDropdownItem } from '../token-dropdown/token-dropdown-item/token-dropdown-item';
import { tokenEqualityFn } from '../token-dropdown/token-equality-fn';
import { TokenValueText } from '../token-value-text/token-value-text';
import { AssetAmountInputProps } from './asset-amount-input.props';
import { useAssetAmountInputStyles } from './asset-amount-input.styles';
import { isString } from '../../utils/is-string';

export interface AssetAmountInterface {
  asset?: TokenInterface;
  amount?: BigNumber;
}

const renderTokenValue: DropdownValueComponent<TokenInterface> = ({ value }) => (
  <TokenDropdownItem
    token={value}
    actionIconName={IconNameEnum.TriangleDown}
    isShowBalance={false}
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
  const styles = useAssetAmountInputStyles();
  const colors = useColors();
  const [inputTypeIndex, setInputTypeIndex] = useState(0);

  const hasExchangeRate = true;
  const isLiquidityProviderToken = isDefined(frozenBalance);
  const asset = value?.asset ?? emptyToken;

  const { stringValue, handleBlur, handleFocus, handleChange } = useNumericInput(
    value.amount,
    asset.decimals,
    onBlur,
    onFocus,
    amount => onValueChange({ ...value, amount })
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <Label label={label} />
        {hasExchangeRate && (
          <TextSegmentControl
            width={formatSize(92)}
            selectedIndex={inputTypeIndex}
            values={['TEZ', 'USD']}
            onChange={setInputTypeIndex}
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
          keyboardType="numeric"
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChangeText={handleChange}
        />
        <Divider size={formatSize(8)} />

        <View
          style={[styles.dropdownContainer, conditionalStyle(isLiquidityProviderToken, styles.lpDropdownContainer)]}>
          <Dropdown
            title="Assets"
            value={value.asset}
            list={assetsList}
            equalityFn={tokenEqualityFn}
            renderValue={renderTokenValue}
            renderListItem={renderTokenListItem}
            onValueChange={asset => onValueChange({ ...value, asset })}
          />
        </View>
      </View>
      <Divider size={formatSize(8)} />

      <View style={styles.footerContainer}>
        <View>
          {hasExchangeRate && (
            <DollarValueText
              token={asset}
              amount={tzToMutez(new BigNumber(isString(stringValue) ? stringValue : '0'), asset.decimals).toFixed()}
              style={styles.equivalentValueText}
            />
          )}
        </View>
        <View style={styles.balanceContainer}>
          {isLiquidityProviderToken && (
            <>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceDescription}>Frozen Balance:</Text>
                <Divider size={formatSize(4)} />
                <TokenValueText token={asset} amount={frozenBalance} style={styles.balanceValueText} />
              </View>
              <Divider size={formatSize(8)} />
            </>
          )}
          <View style={styles.balanceRow}>
            <Text style={styles.balanceDescription}>{isLiquidityProviderToken ? 'Total Balance:' : 'Balance:'}</Text>
            <Divider size={formatSize(4)} />
            <TokenValueText token={asset} amount={asset.balance} style={styles.balanceValueText} />
          </View>
        </View>
      </View>
    </>
  );
};
