import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import { useFormikContext } from 'formik';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  getBestTradeExactInput,
  getTradeOpParams,
  getTradeOutputAmount,
  Trade,
  useAllRoutePairs,
  useRoutePairsCombinations,
  useTradeWithSlippageTolerance
} from 'swap-router-sdk';

import { AssetAmountInterface } from '../../../components/asset-amount-input/asset-amount-input';
import { Divider } from '../../../components/divider/divider';
import { Label } from '../../../components/label/label';
import { FormAssetAmountInput } from '../../../form/form-asset-amount-input/form-asset-amount-input';
import { useFilteredAssetsList } from '../../../hooks/use-filtered-assets-list.hook';
import { useReadOnlyTezosToolkit } from '../../../hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from '../../../interfaces/confirm-payload/confirmation-type.enum';
import { SwapFormValues } from '../../../interfaces/swap-asset.interface';
import { ModalsEnum } from '../../../navigator/enums/modals.enum';
import { navigateAction } from '../../../store/root-state.actions';
import { useSlippageSelector } from '../../../store/settings/settings-selectors';
import { useSelectedAccountSelector, useTokensWithTezosListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { showErrorToast } from '../../../toast/toast.utils';
import { emptyToken, TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { AnalyticsEventCategory } from '../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../utils/analytics/use-analytics.hook';
import { isString } from '../../../utils/is-string';
import { KNOWN_DEX_TYPES, ROUTING_FEE_RATIO, TEZOS_DEXES_API_URL } from '../config';
import { useSwapStyles } from '../swap.styles';
import { getRoutingFeeTransferParams } from '../swap.util';
import { SwapAssetsButton } from './swap-assets-button';
import { SwapExchangeRate } from './swap-exchange-rate';
import { SwapRoute } from './swap-router';
import { SwapSubmitButton } from './swap-submit-button';

const selectionOptions = { start: 0, end: 0 };

interface SwapFormProps {
  loadingHasFailed: boolean;
}

export const SwapForm: FC<SwapFormProps> = ({ loadingHasFailed }) => {
  const styles = useSwapStyles();
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();
  const slippageTolerance = useSlippageSelector();
  const assetsList = useTokensWithTezosListSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);
  const filteredRoutePairs = useMemo(
    () => allRoutePairs.data.filter(routePair => KNOWN_DEX_TYPES.includes(routePair.dexType)),
    [allRoutePairs.data]
  );

  const [bestTrade, setBestTrade] = useState<Trade>([]);

  const { values, setFieldValue } = useFormikContext<SwapFormValues>();
  const { inputAssets, outputAssets } = values;
  const inputAssetSlug = inputAssets.asset === emptyToken ? undefined : getTokenSlug(inputAssets.asset);
  const outputAssetSlug = outputAssets.asset === emptyToken ? undefined : getTokenSlug(outputAssets.asset);

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

  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(assetsList, true);

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
    if (inputMutezAmountWithFee && routePairsCombinations.length > 0) {
      const bestTradeExactIn = getBestTradeExactInput(inputMutezAmountWithFee, routePairsCombinations);
      const bestTradeOutput = getTradeOutputAmount(bestTradeExactIn);

      setBestTrade(bestTradeExactIn);
      setFieldValue('outputAssets.amount', bestTradeOutput);
    } else {
      setBestTrade([]);
      setFieldValue('outputAssets.amount', undefined);
    }
  }, [inputMutezAmountWithFee, routePairsCombinations, outputAssets.asset]);

  const handleInputAssetsValueChange = useCallback(
    (newInputValue: AssetAmountInterface) => {
      if (getTokenSlug(newInputValue.asset) === outputAssetSlug) {
        setFieldValue('outputAssets', { asset: emptyToken, amount: undefined });
      }
    },
    [outputAssetSlug, setFieldValue]
  );

  const handleOutputAssetsValueChange = useCallback(
    (newOutputValue: AssetAmountInterface) => {
      if (getTokenSlug(newOutputValue.asset) === inputAssetSlug) {
        setFieldValue('inputAssets', { asset: emptyToken, amount: undefined });
      }
    },
    [inputAssetSlug, setFieldValue]
  );

  const handleSubmit = async () => {
    const inputMutezAmount = inputAssets.amount;

    const inputAssetSlug = getTokenSlug(inputAssets.asset);
    const outputAssetSlug = getTokenSlug(outputAssets.asset);

    const analyticsProperties = {
      inputAsset: inputAssetSlug,
      outputAsset: outputAssetSlug
    };

    trackEvent('SWAP_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, analyticsProperties);
    const routingFeeOpParams = await getRoutingFeeTransferParams(
      inputMutezAmount,
      bestTradeWithSlippageTolerance,
      selectedAccount.publicKeyHash,
      tezos
    );
    const tradeOpParams = await getTradeOpParams(bestTradeWithSlippageTolerance, selectedAccount.publicKeyHash, tezos);

    const opParams: Array<ParamsWithKind> = [...routingFeeOpParams, ...tradeOpParams].map(transferParams => ({
      ...transferParams,
      kind: OpKind.TRANSACTION
    }));

    if (opParams.length === 0) {
      showErrorToast({ description: 'Transaction params not loaded' });
    }

    dispatch(navigateAction(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.InternalOperations, opParams }));
  };

  return (
    <>
      <View style={styles.container}>
        <Divider size={formatSize(8)} />
        <FormAssetAmountInput
          name="inputAssets"
          label="From"
          isSearchable
          assetsList={filteredAssetsList}
          setSearchValue={setSearchValue}
          onValueChange={handleInputAssetsValueChange}
        />
        <SwapAssetsButton />
        <FormAssetAmountInput
          name="outputAssets"
          label="To"
          selectionOptions={selectionOptions}
          toUsdToggle={false}
          editable={false}
          isSearchable
          assetsList={assetsListWithTez}
          setSearchValue={setSearchTezAssetsValue}
          onValueChange={handleOutputAssetsValueChange}
        />
        <Label label="Swap route" />
        <View>
          <SwapRoute
            inputAssets={inputAssets}
            outputAssets={outputAssets}
            bestTrade={bestTrade}
            loadingHasFailed={loadingHasFailed}
          />

          <Divider />
          <View>
            <SwapExchangeRate
              inputAssets={inputAssets}
              outputAssets={outputAssets}
              bestTrade={bestTrade}
              bestTradeWithSlippageTolerance={bestTradeWithSlippageTolerance}
            />
          </View>
        </View>
        <Divider size={formatSize(16)} />
      </View>
      <SwapSubmitButton inputAssets={inputAssets} outputAssets={outputAssets} onSubmit={handleSubmit} />
    </>
  );
};
