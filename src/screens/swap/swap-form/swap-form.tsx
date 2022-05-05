import { BigNumber } from 'bignumber.js';
import { useFormikContext } from 'formik';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import {
  getBestTradeExactInput,
  getTradeOutputAmount,
  useRoutePairsCombinations,
  useTradeWithSlippageTolerance
} from 'swap-router-sdk';

import { AssetAmountInterface } from '../../../components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { Label } from '../../../components/label/label';
import { useFilteredAssetsList } from '../../../hooks/use-filtered-assets-list.hook';
import { SwapFormValues } from '../../../interfaces/swap-asset.interface';
import { useSlippageSelector } from '../../../store/settings/settings-selectors';
import { useTokensWithTezosListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { emptyToken, TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { isString } from '../../../utils/is-string';
import { ROUTING_FEE_RATIO } from '../config';
import { useSwapStyles } from '../swap.styles';
import { SwapExchangeRate } from './swap-exchange-rate';
import { SwapFormAmountInput } from './swap-form-amount-input';
import { SwapRoute } from './swap-router';

export function atomsToTokens(x: BigNumber, decimals: number) {
  return x.integerValue().div(new BigNumber(10).pow(decimals));
}

export function tokensToAtoms(x: BigNumber, decimals: number) {
  return x.times(new BigNumber(10).pow(decimals)).integerValue();
}

interface SwapFormProps {
  filteredRoutePairs: Array<any>;
  loadingHasFailed: boolean;
}

export const SwapForm: FC<SwapFormProps> = ({ filteredRoutePairs, loadingHasFailed }) => {
  const assetsList = useTokensWithTezosListSelector();
  const styles = useSwapStyles();
  const { values, setFieldValue, submitForm } = useFormikContext<SwapFormValues>();
  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(assetsList, true);
  const slippageTolerance = useSlippageSelector();

  const { inputAssets, outputAssets, bestTrade } = values;

  const inputAssetSlug = getTokenSlug(inputAssets.asset);
  const outputAssetSlug = getTokenSlug(outputAssets.asset);
  const prevOutput = useRef('');

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

  const [searchValue, setSearchTezAssetsValue] = useState<string>();

  const assetsListWithTez = useMemo(() => {
    const sourceArray = assetsList;

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TokenInterface[] = [];

      for (const asset of sourceArray) {
        const { name, symbol, address } = asset;

        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          symbol.toLowerCase().includes(lowerCaseSearchValue) ||
          address.toLowerCase().includes(lowerCaseSearchValue)
        ) {
          result.push(asset);
        }
      }

      return result;
    } else {
      return sourceArray;
    }
  }, [searchValue, assetsList]);

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
    outputAssets.asset.decimals
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
  }, [outputAssets.asset, inputAssets.asset]);

  return (
    <>
      <View style={styles.container}>
        <Divider size={formatSize(8)} />
        <SwapFormAmountInput
          name="inputAssets"
          label="From"
          isSearchable
          assetsList={filteredAssetsList}
          setSearchValue={setSearchValue}
        />
        <View style={styles.swapIconContainer}>
          <TouchableIcon
            onPress={() => swapAction(inputAssets, outputAssets)}
            name={IconNameEnum.SwapArrow}
            size={formatSize(24)}
          />
        </View>
        <SwapFormAmountInput
          name="outputAssets"
          label="To"
          selectionOptions={{ start: 0, end: 0 }}
          toUsdToggle={false}
          editable={false}
          isSearchable
          assetsList={assetsListWithTez}
          setSearchValue={setSearchTezAssetsValue}
        />
        <Label label="Swap route" />
        <View>
          <SwapRoute loadingHasFailed={loadingHasFailed} />

          <Divider />
          <View>
            <SwapExchangeRate />
          </View>
        </View>
        <Divider size={formatSize(16)} />
      </View>
      <View style={styles.submitButton}>
        <ButtonLargePrimary disabled={inputAssetSlug === outputAssetSlug} title="Swap" onPress={submitForm} />
      </View>
    </>
  );
};
