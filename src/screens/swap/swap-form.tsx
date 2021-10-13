import { useField } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { NativeSyntheticEvent, Text, TextInputChangeEventData, TouchableOpacity, View } from 'react-native';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { SelectPercentageButton } from '../../components/select-percentage-button/select-percentage-button';
import { StyledTextInput } from '../../components/styled-text-input/styled-text-input';
import { WarningBlock } from '../../components/warning-block/warning-block';
import { FormAssetAmountInput } from '../../form/form-asset-amount-input/form-asset-amount-input';
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import { useThemeSelector } from '../../store/settings/settings-selectors';
import { useSwapTokensWhitelist } from '../../store/swap/swap-selectors';
import { useAssetsListSelector, useTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { SwapProviderDropdown } from './swap-provider-dropdown';
import { useSwapStyles } from './swap.styles';

export interface SwapFormValues {
  swapFromAmount: AssetAmountInterface;
}

const slippageTolerancePresets = [0.5, 1, 3];

export const SwapForm = () => {
  const theme = useThemeSelector();
  const tokenWhiteList = useSwapTokensWhitelist();
  const [swapProvider, setSwapProvider] = useState('provider1');
  const [swapFromField, , swapFromFieldHelper] = useField<AssetAmountInterface>('swapFromAmount');
  const [swapToField, , swapToFieldHelper] = useField<AssetAmountInterface>('swapToAmount');
  const [isAdvancedParamsShown, setIsAdvancedParamsShown] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState(0);
  const styles = useSwapStyles();
  const assetsList = useAssetsListSelector();
  const { filteredAssetsList } = useFilteredAssetsList(assetsList, true);
  const tezosToken = useTezosTokenSelector();

  const filteredAssetsListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...filteredAssetsList],
    [tezosToken, filteredAssetsList]
  );

  useEffect(() => {
    console.log({ tokenWhiteList });
    console.log({ filteredAssetsListWithTez });
  }, []);

  const swapAssetsHandler = () => {
    const output = swapToField.value;
    const input = swapFromField.value;

    swapToFieldHelper.setValue(input);
    swapFromFieldHelper.setValue(output);
  };

  const onSlippageButtonPressHandler = (value: number) => {
    console.log({ value });
    setSlippageTolerance(value);
  };

  const onChangeSlippageHandler = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setSlippageTolerance(0);
    console.log({ e });
  };

  const renderDropdownValue = () => (
    <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
      <Text style={styles.regularText}>Swap provider</Text>
      <View style={styles.rightSideWrapper}>
        <Icon
          name={theme === 'light' ? IconNameEnum.QuipuswapNewLogoBlack : IconNameEnum.QuipuswapNewLogoWhite}
          width={formatSize(128)}
          height={formatSize(24)}
        />
        <Icon name={IconNameEnum.TriangleDown} size={formatSize(24)} />
      </View>
    </View>
  );

  const listItem = () => (
    <View style={styles.horizontalWrapper}>
      <Icon
        name={theme === 'light' ? IconNameEnum.QuipuswapNewLogoBlack : IconNameEnum.QuipuswapNewLogoWhite}
        width={formatSize(128)}
        height={formatSize(24)}
      />
      <Text style={styles.regularNumbers}>1.0 TOKEN = 2.000000 TMPL</Text>
    </View>
  );

  return (
    <>
      <FormAssetAmountInput name="swapFromAmount" label="From" assetsList={filteredAssetsListWithTez} />
      <TouchableOpacity style={styles.swapActionIconStyle} onPress={swapAssetsHandler}>
        <Icon name={IconNameEnum.SwapAction} size={formatSize(24)} />
      </TouchableOpacity>
      <FormAssetAmountInput name="swapToAmount" label="To" assetsList={filteredAssetsListWithTez} />
      <TouchableOpacity
        style={[styles.horizontalWrapper, styles.verticalMargin]}
        onPress={() => {
          setIsAdvancedParamsShown(!isAdvancedParamsShown);
        }}
      >
        <Text style={styles.boldText}>Advanced parameters</Text>
        <View style={styles.iconWrapper}>
          <Icon name={isAdvancedParamsShown ? IconNameEnum.ChevronUp : IconNameEnum.Gear} />
        </View>
      </TouchableOpacity>
      {isAdvancedParamsShown && (
        <View>
          <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
            <SwapProviderDropdown
              value={swapProvider}
              renderValue={renderDropdownValue}
              listItem={listItem}
              setValueHandler={setSwapProvider}
            />
          </View>
          <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
            <Text style={styles.regularText}>Exchange rate:</Text>
            <Text style={styles.regularNumbers}>---</Text>
          </View>
          <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
            <Text style={styles.regularText}>Fee:</Text>
            <Text style={styles.regularNumbers}>---</Text>
          </View>
          <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
            <Text style={styles.regularText}>Slippage tolerance:</Text>
            <View style={styles.rightSideWrapper}>
              {slippageTolerancePresets.map(preset => (
                <SelectPercentageButton
                  active={preset === slippageTolerance}
                  value={preset}
                  key={preset}
                  onPress={onSlippageButtonPressHandler}
                />
              ))}
            </View>
          </View>
          <StyledTextInput onChange={onChangeSlippageHandler} placeholder="Customize %" />
          <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
            <Text style={styles.regularText}>Minimum received:</Text>
            <Text style={styles.regularNumbers}>---</Text>
          </View>
          <WarningBlock />
        </View>
      )}
    </>
  );
};
