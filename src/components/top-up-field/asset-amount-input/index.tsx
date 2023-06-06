import { BigNumber } from 'bignumber.js';
import { FieldMetaProps } from 'formik';
import React, { FC, memo, useCallback, useMemo, useRef } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Dropdown, DropdownValueComponent } from 'src/components/dropdown/dropdown';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Label } from 'src/components/label/label';
import { useNumericInput } from 'src/hooks/use-numeric-input.hook';
import { TopUpInterfaceBase } from 'src/interfaces/topup.interface';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';

import { renderTopUpTokenListItem, TopUpTokenDropdownItem } from '../dropdown-item';
import { TopUpAssetValueText } from './asset-value-text';
import { TopUpAssetAmountInputSelectors } from './selectors';
import { useTopUpAssetAmountInputStyles } from './styles';
import { TopUpAssetAmountInputProps, TopUpAssetAmountInterface } from './types';

const renderTokenValue: DropdownValueComponent<TopUpInterfaceBase> = ({ value }) => (
  <TopUpTokenDropdownItem
    token={value}
    actionIconName={IconNameEnum.TriangleDown}
    iconSize={formatSize(32)}
    isFacadeItem
  />
);

const defaultNewValueFn: TopUpAssetAmountInputProps['newValueFn'] = (
  newValue: TopUpAssetAmountInterface,
  newAsset: TopUpInterfaceBase,
  amount: BigNumber | undefined
) => ({
  ...newValue,
  asset: newAsset,
  amount
});
const topUpInputEqualityFn = (a: TopUpInterfaceBase, b?: TopUpInterfaceBase) =>
  a.code === b?.code && a.network === b.network;
const topUpInputKeyExtractor = (token: TopUpInterfaceBase, index: number) => `${index}_${token.code}_${token.network}`;

const AssetAmountInputComponent: FC<TopUpAssetAmountInputProps & { meta: FieldMetaProps<TopUpAssetAmountInterface> }> =
  ({
    value,
    label,
    description = 'Assets',
    emptyListText,
    assetsList = [],
    singleAsset = false,
    isSearchable = false,
    isError = false,
    editable = true,
    selectionOptions = undefined,
    setSearchValue,
    meta,
    precision = 18,
    testID,
    tokenTestID,
    newValueFn = defaultNewValueFn,
    onBlur,
    onFocus,
    onValueChange
  }) => {
    const styles = useTopUpAssetAmountInputStyles();
    const colors = useColors();
    const { trackEvent } = useAnalytics();

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
      (newAsset?: TopUpInterfaceBase) => {
        if (isDefined(newAsset)) {
          trackEvent(tokenTestID, AnalyticsEventCategory.ButtonPress, {
            token: newAsset
          });
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

        <View style={[styles.inputContainer, conditionalStyle(isError, styles.inputContainerError)]} testID={testID}>
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
            testID={TopUpAssetAmountInputSelectors.amountInput}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChangeText={handleChange}
          />
          <Divider size={formatSize(8)} />

          <View style={styles.dropdownContainer}>
            {singleAsset ? (
              <TopUpTokenDropdownItem token={value.asset} iconSize={formatSize(32)} isFacadeItem />
            ) : (
              <Dropdown
                description={description}
                emptyListText={emptyListText}
                value={value.asset}
                list={assetsList}
                isSearchable={isSearchable}
                equalityFn={topUpInputEqualityFn}
                setSearchValue={setSearchValue}
                renderValue={renderTokenValue}
                renderListItem={renderTopUpTokenListItem}
                keyExtractor={topUpInputKeyExtractor}
                testID={TopUpAssetAmountInputSelectors.assetInput}
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
