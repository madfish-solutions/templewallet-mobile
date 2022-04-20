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
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { Label } from '../../components/label/label';
import { FormAssetAmountInput } from '../../form/form-asset-amount-input/form-asset-amount-input';
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import { useTokenMetadataGetter } from '../../hooks/use-token-metadata-getter.hook';
import { useTezosTokenSelector, useVisibleAssetListSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { TokenInterface } from '../../token/interfaces/token.interface';
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

export const SwapForm: FC = () => {
  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);
  const assetsList = useVisibleAssetListSelector();
  const styles = useSwapStyles();
  const { values, setFieldValue } = useFormikContext();
  const tezosToken = useTezosTokenSelector();
  const { filteredAssetsList } = useFilteredAssetsList(assetsList, true);
  const [bestTrade, setBestTrade] = useState([]);
  const slippageTolerance = 1.5;

  const { inputAssets, outputAssets } = values;

  const filteredAssetsListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...filteredAssetsList],
    [tezosToken, filteredAssetsList]
  );

  const filteredRoutePairs = useMemo(
    () => allRoutePairs.data.filter(routePair => KNOWN_DEX_TYPES.includes(routePair.dexType)),
    [allRoutePairs.data]
  );

  const routePairsCombinations = useRoutePairsCombinations(
    getTokenSlug(inputAssets.asset),
    getTokenSlug(outputAssets.asset),
    filteredRoutePairs
  );

  const inputMutezAmount = useMemo(
    () => (inputAssets.amount ? tokensToAtoms(inputAssets.amount, inputAssets.asset.decimals) : undefined),
    [inputAssets.amount, inputAssets.asset.decimals]
  );

  const inputMutezAmountWithFee = useMemo(
    () => (inputMutezAmount ? inputMutezAmount.multipliedBy(ROUTING_FEE_RATIO).dividedToIntegerBy(1) : undefined),
    [inputMutezAmount]
  );

  // console.log('inputMutezAmount', inputMutezAmount);
  // console.log('inputMutezAmountWithFee', inputMutezAmountWithFee);

  const bestTradeWithSlippageTolerance = useTradeWithSlippageTolerance(
    inputMutezAmountWithFee,
    bestTrade,
    slippageTolerance
  );

  useEffect(() => {
    if (inputMutezAmountWithFee && routePairsCombinations.length > 0) {
      const bestTradeExactIn = getBestTradeExactInput(inputMutezAmountWithFee, routePairsCombinations);

      const bestTradeOutput = getTradeOutputAmount(bestTradeExactIn);

      const outputTzAmount = bestTradeOutput ? atomsToTokens(bestTradeOutput, outputAssets.asset.decimals) : undefined;
      console.log('bestTradeExactIn', bestTradeExactIn);
      console.log('bestTradeOutput', bestTradeOutput);
      console.log('outputTzAmount', outputTzAmount);
      setBestTrade(bestTradeExactIn);
      setFieldValue('outputAssets', { asset: outputAssets.asset, amount: outputTzAmount });
    } else {
      setBestTrade([]);
      setFieldValue('outputAssets', { asset: outputAssets.asset, amount: undefined });
    }

    // if (isSubmitButtonPressedRef.current) {
    //   triggerValidation();
    // }
  }, [
    inputMutezAmountWithFee,
    outputAssets.asset,
    slippageTolerance,
    routePairsCombinations,
    outputAssets.decimals,
    setFieldValue
    // triggerValidation
  ]);

  const routingFeeAlert = () =>
    Alert.alert(
      'Routing Fee',
      'For choosing the most profitable exchange route among Tezos DEXes. DEXes commissions are not included.',
      [
        {
          text: 'Ok',
          style: 'default'
        }
      ]
    );

  const swapAction = () => {
    setFieldValue('inputAssets', outputAssets);
    setFieldValue('outputAssets', inputAssets);
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
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Routing Fee
              <TouchableIcon onPress={routingFeeAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
            </Text>
            <Text>{ROUTING_FEE_PERCENT}%</Text>
          </View>

          <SwapExchangeRate
            trade={bestTrade}
            inputAssetMetadata={inputAssets.asset}
            outputAssetMetadata={outputAssets.asset}
          />
        </View>
      </View>
      <Divider size={formatSize(16)} />

      <ButtonLargePrimary
        title="Swap"
        onPress={() => {
          console.log('submitted');
        }}
      />
    </View>
  );
};
