import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import {
  DexTypeEnum,
  getBestTradeExactInput,
  getTradeOutputAmount,
  useAllRoutePairs,
  useRoutePairsCombinations,
  useTradeWithSlippageTolerance
} from 'swap-router-sdk';

// TODO: HOW TO TAKE SLUG FROM TOKEN

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { Label } from '../../components/label/label';
import { FormAssetAmountInput } from '../../form/form-asset-amount-input/form-asset-amount-input';
import { useSlippageTolerance } from '../../hooks/slippage-tolerance/use-async-storage.hook';
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import { useTezosTokenSelector, useVisibleAssetListSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { SwapExchangeRate } from './swap-exchange-rate';
import { SwapRoute } from './swap-router';
import { useSwapStyles } from './swap.styles';

export const TEZOS_DEXES_API_URL = 'wss://tezos-dexes-api-mainnet.production.madservice.xyz';
export const ROUTING_FEE_PERCENT = 0.5;
export const ROUTING_FEE_RATIO = (100 - ROUTING_FEE_PERCENT) / 100;

export function atomsToTokens(x: BigNumber, decimals: number) {
  return x.integerValue().div(new BigNumber(10).pow(decimals));
}

export function tokensToAtoms(x: BigNumber, decimals: number) {
  return x.times(10 ** decimals).integerValue();
}
const KNOWN_DEX_TYPES = [DexTypeEnum.QuipuSwap, DexTypeEnum.Plenty, DexTypeEnum.LiquidityBaking, DexTypeEnum.Youves];

interface AssetAmountInterface {
  asset: TokenInterface;
  amount?: BigNumber;
}


 

export const SwapForm: FC = () => {
  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);
  const assetsList = useVisibleAssetListSelector();
  const styles = useSwapStyles();
  const { values, setFieldValue, submitForm } = useFormikContext();
  const tezosToken = useTezosTokenSelector();
  const { filteredAssetsList } = useFilteredAssetsList(assetsList, true);
  const [bestTrade, setBestTrade] = useState([]);
  const { slippageTolerance } = useSlippageTolerance();

  const inputAssets: AssetAmountInterface = values.inputAssets;
  const outputAssets: AssetAmountInterface = values.outputAssets;

  const inputAssetSlug = getTokenSlug(inputAssets.asset);
  const outputAssetSlug = getTokenSlug(outputAssets.asset);

  const filteredAssetsListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...filteredAssetsList],
    [tezosToken, filteredAssetsList]
  );

  const filteredRoutePairs = useMemo(
    () => allRoutePairs.data.filter(routePair => KNOWN_DEX_TYPES.includes(routePair.dexType)),
    [allRoutePairs.data]
  );

  const routePairsCombinations = useRoutePairsCombinations(inputAssetSlug, outputAssetSlug, filteredRoutePairs);

  const inputMutezAmountWithFee = useMemo(
    () => (inputAssets.amount ? inputAssets.amount.multipliedBy(ROUTING_FEE_RATIO).dividedToIntegerBy(1) : undefined),
    [inputAssets.amount]
  );

  const bestTradeWithSlippageTolerance = useTradeWithSlippageTolerance(
    inputMutezAmountWithFee,
    bestTrade,
    slippageTolerance
  );

  useEffect(() => {
    if (inputMutezAmountWithFee && routePairsCombinations.length > 0) {
      const bestTradeExactIn = getBestTradeExactInput(inputMutezAmountWithFee, routePairsCombinations);
      const bestTradeOutput = getTradeOutputAmount(bestTradeExactIn);

      if (outputAssets.asset !== emptyToken) {
        setBestTrade(bestTradeExactIn);
        setFieldValue('outputAssets', { asset: outputAssets.asset, amount: bestTradeOutput });
      }
    } else {
      setBestTrade([]);
      setFieldValue('outputAssets', { asset: inputAssets.asset, amount: undefined });
    }
  }, [
    inputMutezAmountWithFee,
    outputAssetSlug,
    slippageTolerance,
    routePairsCombinations,
    outputAssets.asset.decimals,
    setFieldValue
  ]);

  // setValue([
  //   { input: { assetSlug: outputValue.assetSlug, amount: inputValue.amount } },
  //   { output: { assetSlug: inputValue.assetSlug } }
  // ]);
  const swapAction = () => {
    setFieldValue('inputAssets', { asset: outputAssets.asset, amount: inputAssets.amount });
    setFieldValue('outputAssets', { asset: outputAssets.asset, amount: inputAssets.amount });
  };

  return (
    <View style={styles.container}>
      <Divider size={formatSize(8)} />
      <FormAssetAmountInput name="inputAssets" label="From" assetsList={filteredAssetsListWithTez} />
      <View style={styles.swapIconContainer}>
        <TouchableIcon onPress={swapAction} name={IconNameEnum.SwapArrow} size={formatSize(24)} />
      </View>
      <FormAssetAmountInput
        name="outputAssets"
        label="To"
        assetsList={assetsList}
        isEditable={false}
        // showExchangeRate={false}
      />
      <Label label="Swap route" />
      <View>
        <SwapRoute
          trade={bestTrade}
          inputValue={inputAssets}
          outputValue={outputAssets}
          loadingHasFailed={allRoutePairs.hasFailed}
        />

        <Divider />
        <View>
          <SwapExchangeRate
            trade={bestTrade}
            inputAssetMetadata={inputAssets.asset}
            outputAssetMetadata={outputAssets.asset}
            tradeWithSlippageTolerance={bestTradeWithSlippageTolerance}
          />
        </View>
      </View>
      <Divider size={formatSize(16)} />

      <ButtonLargePrimary title="Swap" onPress={submitForm} />
    </View>
  );
};
