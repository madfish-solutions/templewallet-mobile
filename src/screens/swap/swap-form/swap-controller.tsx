import { useFormikContext } from 'formik';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import {
  getBestTradeExactInput,
  getTradeOutputAmount,
  useAllRoutePairs,
  useRoutePairsCombinations,
  useTradeWithSlippageTolerance
} from 'swap-router-sdk';

import { Divider } from '../../../components/divider/divider';
import { SwapFormValues } from '../../../interfaces/swap-asset.interface';
import { useSlippageSelector } from '../../../store/settings/settings-selectors';
import { formatSize } from '../../../styles/format-size';
import { emptyToken } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { KNOWN_DEX_TYPES, ROUTING_FEE_RATIO, TEZOS_DEXES_API_URL } from '../config';

export const SwapController: FC = () => {
  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);
  const filteredRoutePairs = useMemo(
    () => allRoutePairs.data.filter(routePair => KNOWN_DEX_TYPES.includes(routePair.dexType)),
    [allRoutePairs.data]
  );

  const { values, setFieldValue } = useFormikContext<SwapFormValues>();
  const { inputAssets, outputAssets, bestTrade } = values;
  const slippageTolerance = useSlippageSelector();

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

  return <Divider size={formatSize(8)} />;
};
