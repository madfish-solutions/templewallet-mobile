import { BigNumber } from 'bignumber.js';
import { useFormikContext } from 'formik';
import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import {
  DexTypeEnum,
  getBestTradeExactInput,
  getTradeOutputAmount,
  useAllRoutePairs,
  useRoutePairsCombinations,
  useTradeWithSlippageTolerance
} from 'swap-router-sdk';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { Label } from '../../components/label/label';
import { SwapPriceUpdateBar } from '../../components/swap-price-update-bar/swap-price-update-bar';
import { FormAssetAmountInput } from '../../form/form-asset-amount-input/form-asset-amount-input';
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import { SwapFormValues } from '../../interfaces/swap-asset.interface';
import { useSlippageSelector } from '../../store/settings/settings-selectors';
import { useTezosTokenSelector, useVisibleAssetListSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { isDefined } from '../../utils/is-defined';
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
  return x.times(new BigNumber(10).pow(decimals)).integerValue();
}
const KNOWN_DEX_TYPES = [
  DexTypeEnum.QuipuSwap,
  DexTypeEnum.Plenty,
  DexTypeEnum.LiquidityBaking,
  // DexTypeEnum.QuipuSwapTokenToTokenDex,
  DexTypeEnum.Youves
];

export const SwapForm: FC = () => {
  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);
  const assetsList = useVisibleAssetListSelector();
  const styles = useSwapStyles();
  const { values, setFieldValue, submitForm } = useFormikContext<SwapFormValues>();
  const tezosToken = useTezosTokenSelector();
  const { filteredAssetsList } = useFilteredAssetsList(assetsList, true);
  const slippageTolerance = useSlippageSelector();

  const { inputAssets, outputAssets, bestTrade } = values;

  const inputAssetSlug = getTokenSlug(inputAssets.asset);
  const outputAssetSlug = getTokenSlug(outputAssets.asset);
  const prevOutput = useRef('');

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

  const assetsListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...assetsList].filter(x => !isDefined(x.artifactUri)),
    [tezosToken, assetsList]
  );

  useEffect(() => {
    setFieldValue('bestTradeWithSlippageTolerance', bestTradeWithSlippageTolerance);
  }, [bestTradeWithSlippageTolerance]);

  useEffect(() => {
    if (inputMutezAmountWithFee && routePairsCombinations.length > 0) {
      const bestTradeExactIn = getBestTradeExactInput(inputMutezAmountWithFee, routePairsCombinations);
      const bestTradeOutput = getTradeOutputAmount(bestTradeExactIn);

      if (outputAssets.asset !== emptyToken) {
        setFieldValue('bestTrade', bestTradeExactIn);
        setFieldValue('outputAssets', { asset: outputAssets.asset, amount: bestTradeOutput });
      }
    } else {
      setFieldValue('bestTrade', []);
      setFieldValue('outputAssets', { asset: outputAssets.asset, amount: undefined });
    }
  }, [
    inputMutezAmountWithFee,
    outputAssetSlug,
    slippageTolerance,
    routePairsCombinations,
    outputAssets.asset.decimals,
    setFieldValue
  ]);
  const swapAction = useCallback(
    (inputAsset: AssetAmountInterface, outputAsset: AssetAmountInterface) => {
      setFieldValue('inputAssets', { asset: outputAsset.asset, amount: outputAsset.amount });
      setFieldValue('outputAssets', { asset: inputAsset.asset, amount: inputAsset.amount });
    },
    [outputAssets, inputAssets]
  );

  useEffect(() => {
    const inputAssetSlugInner = getTokenSlug(inputAssets.asset) + ' ' + inputAssets.asset.name;
    const outputAssetSlugInner = getTokenSlug(outputAssets.asset) + ' ' + outputAssets.asset.name;
    if (inputAssetSlugInner === prevOutput.current && inputAssetSlugInner === outputAssetSlugInner) {
      setFieldValue('outputAssets', {
        asset: emptyToken,
        amount: undefined
      });
    } else if (outputAssetSlugInner !== prevOutput.current && inputAssetSlugInner === outputAssetSlugInner) {
      setFieldValue('inputAssets', {
        asset: emptyToken,
        amount: undefined
      });
    }
    prevOutput.current = outputAssetSlugInner;
  }, [outputAssets.asset, inputAssets.asset, setFieldValue]);

  console.log(assetsListWithTez);

  return (
    <>
      <ScrollView>
        <SwapPriceUpdateBar />
        <View style={styles.container}>
          <Divider size={formatSize(8)} />
          <FormAssetAmountInput name="inputAssets" label="From" assetsList={filteredAssetsListWithTez} />
          <View style={styles.swapIconContainer}>
            <TouchableIcon
              onPress={() => swapAction(inputAssets, outputAssets)}
              name={IconNameEnum.SwapArrow}
              size={formatSize(24)}
            />
          </View>
          <FormAssetAmountInput
            name="outputAssets"
            label="To"
            toUsdToggle={false}
            editable={false}
            assetsList={assetsListWithTez}
          />
          <Label label="Swap route" />
          <View>
            <SwapRoute trade={bestTrade} />

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
        </View>
      </ScrollView>
      <View style={styles.submitButton}>
        <ButtonLargePrimary disabled={inputAssetSlug === outputAssetSlug} title="Swap" onPress={submitForm} />
      </View>
    </>
  );
};
