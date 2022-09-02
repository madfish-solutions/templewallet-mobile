import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';
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
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from '../../../components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from '../../../components/divider/divider';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { tokenEqualityFn } from '../../../components/token-dropdown/token-equality-fn';
import { FormAssetAmountInput } from '../../../form/form-asset-amount-input/form-asset-amount-input';
import { useFilteredAssetsList } from '../../../hooks/use-filtered-assets-list.hook';
import { useReadOnlyTezosToolkit } from '../../../hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from '../../../interfaces/confirm-payload/confirmation-type.enum';
import { SwapFormValues } from '../../../interfaces/swap-asset.interface';
import { ModalsEnum } from '../../../navigator/enums/modals.enum';
import { navigateAction } from '../../../store/root-state.actions';
import { useSlippageSelector } from '../../../store/settings/settings-selectors';
import {
  useSelectedAccountSelector,
  useSelectedAccountTezosTokenSelector,
  useTokensWithTezosListSelector
} from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { showErrorToast } from '../../../toast/toast.utils';
import { emptyTezosLikeToken, TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { AnalyticsEventCategory } from '../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../utils/analytics/use-analytics.hook';
import { isString } from '../../../utils/is-string';
import { KNOWN_DEX_TYPES, ROUTING_FEE_RATIO, TEZOS_DEXES_API_URL } from '../config';
import { getRoutingFeeTransferParams } from '../swap.util';
import { SwapAssetsButton } from './swap-assets-button/swap-assets-button';
import { SwapExchangeRate } from './swap-exchange-rate/swap-exchange-rate';
import { swapFormValidationSchema } from './swap-form.form';
import { SwapPriceUpdateBar } from './swap-price-update-bar/swap-price-update-bar';
import { useSwapPriceUpdateInfo } from './swap-price-update-bar/swap-price-update-info.hook';
import { SwapPriceUpdateText } from './swap-price-update-bar/swap-price-update-text';
import { SwapRoute } from './swap-route/swap-route';

const selectionOptions = { start: 0, end: 0 };

interface SwapFormProps {
  inputToken?: TokenInterface;
}

export const SwapForm: FC<SwapFormProps> = ({ inputToken }) => {
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();
  const slippageTolerance = useSlippageSelector();
  const assetsList = useTokensWithTezosListSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);
  const priceUpdateInfo = useSwapPriceUpdateInfo(allRoutePairs.block);
  const filteredRoutePairs = useMemo(
    () => allRoutePairs.data.filter(routePair => KNOWN_DEX_TYPES.includes(routePair.dexType)),
    [allRoutePairs.data]
  );

  const [bestTrade, setBestTrade] = useState<Trade>([]);

  const handleSubmit = async () => {
    const inputAssetSlug = getTokenSlug(inputAssets.asset);
    const outputAssetSlug = getTokenSlug(outputAssets.asset);

    const analyticsProperties = {
      inputAsset: inputAssetSlug,
      outputAsset: outputAssetSlug
    };

    trackEvent('SWAP_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, analyticsProperties);
    const routingFeeOpParams = await getRoutingFeeTransferParams(
      bestTradeWithSlippageTolerance[bestTradeWithSlippageTolerance.length - 1].aTokenAmount,
      bestTradeWithSlippageTolerance,
      selectedAccount.publicKeyHash,
      tezos
    );
    const tradeOpParams = await getTradeOpParams(bestTradeWithSlippageTolerance, selectedAccount.publicKeyHash, tezos);

    const opParams: Array<ParamsWithKind> = [...tradeOpParams, ...routingFeeOpParams].map(transferParams => ({
      ...transferParams,
      kind: OpKind.TRANSACTION
    }));

    if (opParams.length === 0) {
      showErrorToast({ description: 'Transaction params not loaded' });
    }

    dispatch(navigateAction(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.InternalOperations, opParams }));
  };

  const tezosToken = useSelectedAccountTezosTokenSelector();

  const formik = useFormik<SwapFormValues>({
    initialValues: {
      inputAssets: {
        asset: inputToken ?? tezosToken,
        amount: undefined
      },
      outputAssets: {
        asset: emptyTezosLikeToken,
        amount: undefined
      }
    },
    validationSchema: swapFormValidationSchema,
    onSubmit: handleSubmit
  });

  const { values, setFieldValue, isValid, submitForm, submitCount } = formik;
  const { inputAssets, outputAssets } = values;

  const inputAssetSlug = tokenEqualityFn(inputAssets.asset, emptyTezosLikeToken)
    ? undefined
    : getTokenSlug(inputAssets.asset);
  const outputAssetSlug = tokenEqualityFn(outputAssets.asset, emptyTezosLikeToken)
    ? undefined
    : getTokenSlug(outputAssets.asset);

  const routePairsCombinations = useRoutePairsCombinations(inputAssetSlug, outputAssetSlug, filteredRoutePairs);

  const bestTradeWithSlippageTolerance = useTradeWithSlippageTolerance(
    inputAssets.amount,
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
    if (inputAssets.amount && routePairsCombinations.length > 0) {
      const bestTradeExactIn = getBestTradeExactInput(inputAssets.amount, routePairsCombinations);
      const bestTradeOutput = getTradeOutputAmount(bestTradeExactIn);

      setBestTrade(bestTradeExactIn);
      setFieldValue(
        'outputAssets.amount',
        bestTradeOutput?.multipliedBy(ROUTING_FEE_RATIO).dividedToIntegerBy(1) ?? undefined,
        false
      );
    } else {
      setBestTrade([]);
      setFieldValue('outputAssets.amount', undefined, false);
    }
  }, [inputAssets.amount, routePairsCombinations, outputAssets.asset]);

  const handleInputAssetsValueChange = useCallback(
    (newInputValue: AssetAmountInterface) => {
      const isEmptyToken = tokenEqualityFn(newInputValue.asset, emptyTezosLikeToken);
      if (getTokenSlug(newInputValue.asset) === outputAssetSlug && !isEmptyToken) {
        setFieldValue('outputAssets', { asset: emptyTezosLikeToken, amount: undefined });
      }
    },
    [outputAssetSlug, setFieldValue]
  );

  const handleOutputAssetsValueChange = useCallback(
    (newOutputValue: AssetAmountInterface) => {
      if (getTokenSlug(newOutputValue.asset) === inputAssetSlug) {
        setFieldValue('inputAssets', { asset: emptyTezosLikeToken, amount: undefined });
      }
    },
    [inputAssetSlug, setFieldValue]
  );

  return (
    <FormikProvider value={formik}>
      <SwapPriceUpdateBar
        nowTimestamp={priceUpdateInfo.nowTimestamp}
        blockEndTimestamp={priceUpdateInfo.blockEndTimestamp}
      />
      <ScreenContainer
        scrollViewRefreshControl={
          <RefreshControl refreshing={allRoutePairs.isRefreshing} onRefresh={allRoutePairs.onRefresh} />
        }
      >
        <SwapPriceUpdateText
          nowTimestamp={priceUpdateInfo.nowTimestamp}
          blockEndTimestamp={priceUpdateInfo.blockEndTimestamp}
        />
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
            trade={bestTrade}
            loadingHasFailed={allRoutePairs.hasFailed}
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
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonLargePrimary disabled={submitCount !== 0 && !isValid} title="Swap" onPress={submitForm} />
      </ButtonsFloatingContainer>
    </FormikProvider>
  );
};
