import { BigNumber } from 'bignumber.js';
import React, { FC, memo, useCallback, useMemo, useRef } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { Dropdown, DropdownValueComponent } from '../../../../components/dropdown/dropdown';
import { HideBalance } from '../../../../components/hide-balance/hide-balance';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { Label } from '../../../../components/label/label';
import { emptyFn } from '../../../../config/general';
import { useNumericInput } from '../../../../hooks/use-numeric-input.hook';
import { CurrenciesInterface } from '../../../../interfaces/exolix.interface';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { isDefined } from '../../../../utils/is-defined';
import { ExolixTokenDropdownItem, renderExolixTokenListItem } from '../exolix-token-dropdown-item/exolix-dropdown-item';
import { initialData } from '../initial-step.data';
import { useExolixAssetAmountInputStyles } from './exolix-asset-amount-input.styles';
import { ExolixAssetValueText } from './exolix-asset-value-text';
import { ExolixAssetAmountInputProps } from './exolix-form-asset-input.props';

export interface ExolixAssetAmountInterface {
  asset: CurrenciesInterface;
  amount?: BigNumber;
  min?: number;
  max?: number;
}

const renderTokenValue: DropdownValueComponent<CurrenciesInterface> = ({ value }) => (
  <ExolixTokenDropdownItem token={value} actionIconName={IconNameEnum.TriangleDown} iconSize={formatSize(32)} />
);

const AssetAmountInputComponent: FC<ExolixAssetAmountInputProps> = ({
  value,
  label,
  assetsList,
  isError = false,
  editable = true,
  isSearchable = false,
  selectionOptions = undefined,
  setSearchValue = emptyFn,
  onBlur,
  onFocus,
  onValueChange
}) => {
  const styles = useExolixAssetAmountInputStyles();
  const colors = useColors();

  const amountInputRef = useRef<TextInput>(null);

  const amount = value?.amount ?? new BigNumber(0);

  const inputValueRef = useRef<BigNumber>();

  const numericInputValue = useMemo(() => {
    const newNumericInputValue = amount;

    inputValueRef.current = newNumericInputValue;

    return newNumericInputValue;
  }, [amount]);

  console.log(value);

  const onChange = useCallback(
    newInputValue => {
      inputValueRef.current = newInputValue;

      onValueChange({
        ...value,
        amount: newInputValue
      });
    },
    [value, onValueChange]
  );

  const { stringValue, handleBlur, handleFocus, handleChange } = useNumericInput(
    numericInputValue,
    18,
    onChange,
    onBlur,
    onFocus
  );

  const handleTokenChange = useCallback(
    (newAsset?: CurrenciesInterface) => {
      if (isDefined(newAsset)) {
        onValueChange({
          asset: newAsset
        });
      }
    },
    [onValueChange]
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <Label label={label} />
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

        <View style={styles.dropdownContainer}>
          <Dropdown
            title="Assets"
            value={value.asset}
            list={assetsList}
            isSearchable={isSearchable}
            setSearchValue={setSearchValue}
            equalityFn={(item, value) => item.code === (value ?? initialData.coinFrom.asset).code}
            renderValue={renderTokenValue}
            renderListItem={renderExolixTokenListItem}
            keyExtractor={(token: CurrenciesInterface) => token.code}
            onValueChange={handleTokenChange}
          />
        </View>
      </View>
      <Divider size={formatSize(8)} />

      <View style={styles.footerContainer}>
        <ExolixAssetValueText amount={amount} asset={value.asset} style={styles.equivalentValueText} />
        <View style={styles.balanceContainer}>
          {isDefined(value.min) && (
            <View style={styles.balanceRow}>
              <Text style={styles.balanceDescription}>{'Min:'}</Text>
              <Divider size={formatSize(4)} />
              <HideBalance style={styles.balanceValueText}>
                <ExolixAssetValueText
                  amount={new BigNumber(value.min)}
                  asset={value.asset}
                  style={styles.balanceValueText}
                />
              </HideBalance>
            </View>
          )}

          {isDefined(value.max) && (
            <View style={styles.balanceRow}>
              <Text style={styles.balanceDescription}>{'Max:'}</Text>
              <Divider size={formatSize(4)} />
              <HideBalance style={styles.balanceValueText}>
                <ExolixAssetValueText
                  amount={new BigNumber(value.max)}
                  asset={value.asset}
                  style={styles.balanceValueText}
                />
              </HideBalance>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export const ExolixAssetAmountInput = memo(AssetAmountInputComponent) as typeof AssetAmountInputComponent;
