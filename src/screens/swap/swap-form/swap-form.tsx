import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  getBestTradeExactInput,
  getTradeOpParams,
  getTradeOutputAmount,
  getTradeOutputOperation,
  Trade,
  useAllRoutePairs,
  useRoutePairsCombinations,
  useTradeWithSlippageTolerance
} from 'swap-router-sdk';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { RefreshControl } from 'src/components/refresh-control/refresh-control';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { tokenEqualityFn } from 'src/components/token-dropdown/token-equality-fn';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { SwapFormValues } from 'src/interfaces/swap-asset.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { navigateAction } from 'src/store/root-state.actions';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import {
  useSelectedAccountSelector,
  useSelectedAccountTezosTokenSelector,
  useTokensListSelector
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { emptyTezosLikeToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { TEZOS_DEXES_API_URL } from 'src/utils/env.utils';
import { isDefined } from 'src/utils/is-defined';

import { KNOWN_DEX_TYPES, ROUTING_FEE_ADDRESS, ROUTING_FEE_RATIO } from '../config';
import { getRoutingFeeTransferParams } from '../swap.util';
import { SwapAssetsButton } from './swap-assets-button/swap-assets-button';
import { SwapExchangeRate } from './swap-exchange-rate/swap-exchange-rate';
import { swapFormValidationSchema } from './swap-form.form';
import { SwapFormSelectors } from './swap-form.selectors';
import { SwapRoute } from './swap-route/swap-route';

const selectionOptions = { start: 0, end: 0 };

interface SwapFormProps {
  inputToken?: TokenInterface;
  outputToken?: TokenInterface;
}

export const SwapForm: FC<SwapFormProps> = ({ inputToken, outputToken }) => {
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();
  const slippageTolerance = useSlippageSelector();
  const assetsList = useTokensListSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);
  const filteredRoutePairs = useMemo(
    () => allRoutePairs.data.filter(routePair => KNOWN_DEX_TYPES.includes(routePair.dexType)),
    [allRoutePairs.data]
  );

  const handleSubmit = async () => {
    const inputAssetSlug = getTokenSlug(inputAssets.asset);
    const outputAssetSlug = getTokenSlug(outputAssets.asset);

    const analyticsProperties = {
      inputAsset: inputAssetSlug,
      outputAsset: outputAssetSlug
    };

    trackEvent('SWAP_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, analyticsProperties);
    const routingFeeOpParams = await getRoutingFeeTransferParams(
      bestTradeWithSlippageTolerance,
      feeAmount,
      selectedAccount.publicKeyHash,
      tezos
    );
    const tradeOpParams = await getTradeOpParams(
      bestTradeWithSlippageTolerance,
      selectedAccount.publicKeyHash,
      tezos,
      ROUTING_FEE_ADDRESS
    );

    const opParams: Array<ParamsWithKind> = [...tradeOpParams, ...routingFeeOpParams].map(transferParams => ({
      ...transferParams,
      kind: OpKind.TRANSACTION
    }));

    if (opParams.length === 0) {
      showErrorToast({ description: 'Transaction params not loaded' });
    }

    dispatch(
      navigateAction(ModalsEnum.Confirmation, {
        type: ConfirmationTypeEnum.InternalOperations,
        opParams,
        testID: 'SWAP_TRANSACTION_SENT'
      })
    );
  };

  const formik = useFormik<SwapFormValues>({
    initialValues: {
      inputAssets: {
        asset: inputToken ?? tezosToken,
        amount: undefined
      },
      outputAssets: {
        asset: outputToken ?? emptyTezosLikeToken,
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

  const bestTrade = useMemo<Trade>(
    () =>
      inputAssets.amount && routePairsCombinations.length > 0
        ? getBestTradeExactInput(inputAssets.amount, routePairsCombinations)
        : [],
    [inputAssets.amount, routePairsCombinations, outputAssets.asset]
  );

  const bestTradeWithSlippageTolerance = useTradeWithSlippageTolerance(
    inputAssets.amount,
    bestTrade,
    slippageTolerance
  );

  const { feeAmount, minimumReceivedAmount } = useMemo(() => {
    const bestTradeWithSlippageToleranceOutput = getTradeOutputAmount(bestTradeWithSlippageTolerance);
    const tradeOutputOperation = getTradeOutputOperation(bestTradeWithSlippageTolerance);

    if (isDefined(bestTradeWithSlippageToleranceOutput) && isDefined(tradeOutputOperation)) {
      const feeAmount = bestTradeWithSlippageToleranceOutput.minus(
        tradeOutputOperation.bTokenAmount.multipliedBy(ROUTING_FEE_RATIO).dividedToIntegerBy(1)
      );
      const minimumReceivedAmount = bestTradeWithSlippageToleranceOutput.minus(feeAmount);

      return { feeAmount, minimumReceivedAmount };
    } else {
      const feeAmount = new BigNumber(0);
      const minimumReceivedAmount = undefined;

      return { feeAmount, minimumReceivedAmount };
    }
  }, [bestTradeWithSlippageTolerance]);

  const { filteredAssetsList: fromAssetsList, setSearchValue: setFromSearchValue } = useFilteredAssetsList(
    assetsList,
    true,
    true,
    tezosToken
  );

  const nonEmptyFromAssetsList = fromAssetsList.length ? fromAssetsList : [tezosToken];

  const { filteredAssetsList: toAssetsList, setSearchValue: setToSearchValue } = useFilteredAssetsList(
    assetsList,
    false,
    true,
    tezosToken
  );

  useEffect(() => {
    if (bestTrade.length > 0) {
      const bestTradeOutput = getTradeOutputAmount(bestTrade);
      const displayedBestTradeOutput = isDefined(bestTradeOutput) ? bestTradeOutput.minus(feeAmount) : undefined;

      setFieldValue('outputAssets.amount', displayedBestTradeOutput, false);
    } else {
      setFieldValue('outputAssets.amount', undefined, false);
    }
  }, [bestTrade, feeAmount]);

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
      <ScreenContainer
        scrollViewRefreshControl={
          <RefreshControl refreshing={allRoutePairs.isRefreshing} onRefresh={allRoutePairs.onRefresh} />
        }
      >
        <Divider size={formatSize(8)} />

        <FormAssetAmountInput
          name="inputAssets"
          label="From"
          isSearchable
          maxButton
          assetsList={nonEmptyFromAssetsList}
          setSearchValue={setFromSearchValue}
          onValueChange={handleInputAssetsValueChange}
          testID={SwapFormSelectors.fromAssetAmountInput}
        />
        <SwapAssetsButton />

        <FormAssetAmountInput
          name="outputAssets"
          label="To"
          selectionOptions={selectionOptions}
          toUsdToggle={false}
          editable={false}
          isSearchable
          assetsList={toAssetsList}
          setSearchValue={setToSearchValue}
          onValueChange={handleOutputAssetsValueChange}
          testID={SwapFormSelectors.toAssetAmountInput}
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
              minimumReceivedAmount={minimumReceivedAmount}
            />
          </View>
        </View>

        <Divider size={formatSize(16)} />
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          disabled={submitCount !== 0 && !isValid}
          title="Swap"
          onPress={submitForm}
          testID={SwapFormSelectors.swapButton}
        />
      </ButtonsFloatingContainer>
    </FormikProvider>
  );
};
