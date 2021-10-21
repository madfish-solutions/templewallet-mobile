import { findDex, FoundDex } from '@quipuswap/sdk';
import { BigNumber } from 'bignumber.js';
import { useField } from 'formik';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { NativeSyntheticEvent, Text, TextInputChangeEventData, TouchableOpacity, View } from 'react-native';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { SelectPercentageButton } from '../../components/select-percentage-button/select-percentage-button';
import { StyledTextInput } from '../../components/styled-text-input/styled-text-input';
import { WarningBlock } from '../../components/warning-block/warning-block';
import { FormAssetAmountInput } from '../../form/form-asset-amount-input/form-asset-amount-input';
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import { TokenTypeEnum } from '../../interfaces/token-type.enum';
import { useThemeSelector } from '../../store/settings/settings-selectors';
import {
  useAssetsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenType } from '../../token/utils/token.utils';
import { createReadOnlyTezosToolkit } from '../../utils/network/tezos-toolkit.utils';
import { tzToMutez, mutezToTz } from '../../utils/tezos.util';
import { TokenMetadataResponse } from '../../utils/token-metadata.utils';
import { SwapProviderDropdown } from './swap-provider-dropdown';
import { useSwapStyles } from './swap.styles';

export interface SwapFormValues {
  swapFromAmount: AssetAmountInterface;
}

const slippageTolerancePresets = [0.5, 1, 3];
const fee = 997;
export const QS_FACTORIES = {
  fa1_2Factory: ['KT1FWHLMk5tHbwuSsp31S4Jum4dTVmkXpfJw', 'KT1Lw8hCoaBrHeTeMXbqHPG4sS4K1xn7yKcD'],
  fa2Factory: ['KT1PvEyN1xCFCgorN92QCfYjw3axS6jawCiJ', 'KT1SwH9P1Tx8a58Mm6qBExQFTcy2rwZyZiXS']
};

interface Props {
  tokenWhiteList: TokenMetadataResponse[];
  tokenWhiteListIsLoading: boolean;
}

export const SwapForm: FC<Props> = ({ tokenWhiteList, tokenWhiteListIsLoading }) => {
  const theme = useThemeSelector();
  const [inputDexState, setInputDexState] = useState<FoundDex>();
  const [outputDexState, setOutputDexState] = useState<FoundDex>();
  const [isDexLoaded, setIsDexLoaded] = useState<boolean>(false);
  const [swapProvider, setSwapProvider] = useState('provider1');
  const [swapFromField, , swapFromFieldHelper] = useField<AssetAmountInterface>('swapFromAmount');
  const [swapToField, , swapToFieldHelper] = useField<AssetAmountInterface>('swapToAmount');
  const [isAdvancedParamsShown, setIsAdvancedParamsShown] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState(0);
  const styles = useSwapStyles();
  const assetsList = useAssetsListSelector();
  const { filteredAssetsList } = useFilteredAssetsList(assetsList, true);
  const tezosToken = useTezosTokenSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = createReadOnlyTezosToolkit(selectedAccount);

  const filteredAssetsListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...filteredAssetsList],
    [tezosToken, filteredAssetsList]
  );

  const findDexHandler = async (address: string) => {
    const tokenContract = await tezos.contract.at(address);
    const tokenType = getTokenType(tokenContract);
    const token = {
      contract: tokenContract,
      ...(tokenType === TokenTypeEnum.FA_2 && { id: new BigNumber(swapToField.value.asset.id) })
    };

    return await findDex(tezos, QS_FACTORIES, token);
  };

  const estimateAssetToAsset = (dexStorage: FoundDex, tezValue: BigNumber | undefined, tokenToTez = false) => {
    const tezValueBN = new BigNumber(tezValue ?? '0');
    if (tezValueBN.isZero()) {
      return new BigNumber(0);
    }

    const tezInWithFee = new BigNumber(tezValue ?? 0).times(fee);
    const numerator = tezInWithFee.times(tokenToTez ? dexStorage.storage.tez_pool : dexStorage.storage.token_pool);
    const denominator = new BigNumber(tokenToTez ? dexStorage.storage.token_pool : dexStorage.storage.tez_pool)
      .times(1000)
      .plus(tezInWithFee);

    return numerator.idiv(denominator);
  };

  const calculateEstimateOutputValue = (tokenToTez = false) => {
    
    const inputDex = { inputDex: inputDexState };
    const outputDex = { outputDex: outputDexState };

    console.log(
      estimateAssetToAsset(
        inputDex.inputDex?.storage,
        tzToMutez(new BigNumber(swapFromField.value.amount ?? 0), swapFromField.value.asset.decimals)
      )
    );

    const estimatedOutputValue = estimateAssetToAsset(
      inputDex.inputDex?.storage,
      tzToMutez(new BigNumber(swapFromField.value.amount ?? 0), swapFromField.value.asset.decimals),
      tokenToTez
    );

    return estimatedOutputValue;
  };

  useEffect(() => {
    if (isDexLoaded) {
      const tokenToTez =
        swapFromField.value.asset.name !== TEZ_TOKEN_METADATA.name &&
        swapToField.value.asset.name === TEZ_TOKEN_METADATA.name;
      const estimatedOutputValue = calculateEstimateOutputValue(tokenToTez);

      swapToFieldHelper.setValue({
        ...swapToField.value,
        amount: mutezToTz(new BigNumber(estimatedOutputValue ?? '0'), swapToField.value.asset.decimals)
      });
    }
  }, [swapFromField.value.amount, isDexLoaded]);

  // refactor into separate function findDex
  useEffect(() => {
    setIsDexLoaded(false);

    (async () => {
      if (
        swapFromField.value.asset.name === TEZ_TOKEN_METADATA.name &&
        swapToField.value.asset.name !== TEZ_TOKEN_METADATA.name
      ) {
        try {
          if (swapToField.value.asset.address !== '') {
            setInputDexState(await findDexHandler(swapToField.value.asset.address));
            setIsDexLoaded(true);
          }
        } catch (e) {
          console.log({ e });
        }
      } else if (
        swapFromField.value.asset.name !== TEZ_TOKEN_METADATA.name &&
        swapToField.value.asset.name === TEZ_TOKEN_METADATA.name
      ) {
        try {
          setOutputDexState(await findDexHandler(swapFromField.value.asset.address));
          setIsDexLoaded(true);
        } catch (e) {
          console.log({ e });
        }
      } else if (
        swapFromField.value.asset.name !== TEZ_TOKEN_METADATA.name &&
        swapToField.value.asset.name !== TEZ_TOKEN_METADATA.name
      ) {
        setInputDexState(await findDexHandler(swapFromField.value.asset.address));
        setOutputDexState(await findDexHandler(swapToField.value.asset.address));
        setIsDexLoaded(true);
      }
    })();
  }, [swapFromField.value.asset, swapToField.value.asset]);

  const swapAssetsHandler = () => {
    swapToFieldHelper.setValue({
      ...swapFromField.value,
      amount: new BigNumber(0)
    });
    swapFromFieldHelper.setValue({
      ...swapToField.value,
      amount: new BigNumber(0)
    });
  };

  const onSlippageButtonPressHandler = (value: number) => {
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
      <FormAssetAmountInput
        name="swapToAmount"
        label="To"
        assetsList={
          !tokenWhiteListIsLoading && tokenWhiteList !== [] ? (tokenWhiteList as unknown as TokenInterface[]) : []
        }
      />
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
            <Text style={styles.regularNumbers}>{(1000 - fee) / 10}%</Text>
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
