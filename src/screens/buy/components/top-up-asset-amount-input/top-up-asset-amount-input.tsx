import { BigNumber } from 'bignumber.js';
import { FieldMetaProps } from 'formik';
import React, { FC, memo, useCallback, useMemo, useRef } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { Dropdown, DropdownValueComponent } from '../../../../components/dropdown/dropdown';
import { HideBalance } from '../../../../components/hide-balance/hide-balance';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { Label } from '../../../../components/label/label';
import { useNumericInput } from '../../../../hooks/use-numeric-input.hook';
import { TopUpInputInterface } from '../../../../interfaces/topup.interface';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { isDefined } from '../../../../utils/is-defined';
import { initialData } from '../../crypto/exolix/steps/initial-step/initial-step.data';
import {
  renderTopUpTokenListItem,
  TopUpTokenDropdownItem
} from '../top-up-token-dropdown-item/top-up-token-dropdown-item';
import { TopUpAssetAmountInputProps, TopUpAssetAmountInterface } from './top-up-asset-amount-input.props';
import { useTopUpAssetAmountInputStyles } from './top-up-asset-amount-input.styles';
import { TopUpAssetValueText } from './top-up-asset-value-text';

const renderTokenValue: DropdownValueComponent<TopUpInputInterface> = ({ value }) => (
  <TopUpTokenDropdownItem
    token={value}
    actionIconName={IconNameEnum.TriangleDown}
    iconSize={formatSize(32)}
    isDropdownClosed
  />
);

const defaultNewValueFn: TopUpAssetAmountInputProps['newValueFn'] = (
  newValue: TopUpAssetAmountInterface,
  newAsset: TopUpInputInterface,
  amount: BigNumber | undefined
) => ({
  ...newValue,
  asset: newAsset,
  amount
});

const AssetAmountInputComponent: FC<TopUpAssetAmountInputProps & { meta: FieldMetaProps<TopUpAssetAmountInterface> }> =
  ({
    value = initialData.coinFrom,
    label,
    assetsList = [],
    singleAsset = false,
    isSearchable = false,
    isError = false,
    editable = true,
    selectionOptions = undefined,
    setSearchValue,
    meta,
    precision = 18,
    newValueFn = defaultNewValueFn,
    onBlur,
    onFocus,
    onValueChange
  }) => {
    const styles = useTopUpAssetAmountInputStyles();
    const colors = useColors();

    const error: string | Record<string, string> = (meta.touched ? meta.error : undefined) ?? {};
    const errorStr = (typeof error === 'string' ? error : error[Object.keys(error)[0]]) || ' ';

    const isMinError = errorStr === 'min';
    const isMaxError = errorStr === 'max';

    const amountInputRef = useRef<TextInput>(null);

    const amount = value.amount;

    const inputValueRef = useRef<BigNumber>();

    const numericInputValue = useMemo(() => {
      const newNumericInputValue = amount;

      inputValueRef.current = newNumericInputValue;

      return newNumericInputValue;
    }, [amount]);

    const onChange = useCallback(
      newInputValue => {
        inputValueRef.current = newInputValue;

        onValueChange(newValueFn(value, value.asset, newInputValue));
      },
      [value, onValueChange]
    );

    const { stringValue, handleBlur, handleFocus, handleChange } = useNumericInput(
      numericInputValue,
      precision,
      undefined,
      undefined,
      onChange,
      onBlur,
      onFocus
    );

    const handleTokenChange = useCallback(
      (newAsset?: TopUpInputInterface) => {
        if (isDefined(newAsset)) {
          onValueChange(newValueFn(value, newAsset, inputValueRef.current));
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
            {singleAsset ? (
              <TopUpTokenDropdownItem token={value.asset} iconSize={formatSize(32)} isDropdownClosed />
            ) : (
              <Dropdown
                description="Assets"
                value={value.asset}
                list={assetsList}
                isSearchable={isSearchable}
                equalityFn={(item, value) => item.code === value?.code && item.network === value.network}
                setSearchValue={setSearchValue}
                renderValue={renderTokenValue}
                renderListItem={renderTopUpTokenListItem}
                keyExtractor={(token: TopUpInputInterface, index) => `${index}_${token.code}_${token.network}`}
                onValueChange={handleTokenChange}
              />
            )}
          </View>
        </View>
        <Divider size={formatSize(8)} />

        <View style={styles.footerContainer}>
          <View style={styles.balanceContainer}>
            {isDefined(value.min) && (
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceDescription, conditionalStyle(isMinError, styles.textError)]}>Min:</Text>
                <Divider size={formatSize(4)} />
                <HideBalance style={styles.balanceValueText}>
                  <TopUpAssetValueText
                    amount={new BigNumber(value.min)}
                    style={[styles.balanceValueText, conditionalStyle(isMinError, styles.textError)]}
                  />
                </HideBalance>
                <Text style={[styles.balanceValueText, conditionalStyle(isMinError, styles.textError)]}>
                  {' ' + value?.asset.code}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.balanceContainer}>
            {isDefined(value.max) && (
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceDescription, conditionalStyle(isMaxError, styles.textError)]}>Max:</Text>
                <Divider size={formatSize(4)} />
                <HideBalance style={styles.balanceValueText}>
                  <TopUpAssetValueText
                    amount={new BigNumber(value.max)}
                    style={[styles.balanceValueText, conditionalStyle(isMaxError, styles.textError)]}
                  />
                </HideBalance>
                <Text style={[styles.balanceValueText, conditionalStyle(isMaxError, styles.textError)]}>
                  {' ' + value?.asset.code}
                </Text>
              </View>
            )}
          </View>
        </View>
      </>
    );
  };

export const TopUpAssetAmountInput = memo(AssetAmountInputComponent) as typeof AssetAmountInputComponent;
