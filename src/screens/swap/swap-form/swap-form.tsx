import { OpKind } from '@taquito/rpc';
import { ParamsWithKind, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { FormikProvider, isEmptyArray, useFormik } from 'formik';
import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { tokenEqualityFn } from 'src/components/token-dropdown/token-equality-fn';
import {
  ATOMIC_INPUT_THRESHOLD_FOR_FEE_FROM_INPUT,
  BURN_ADDREESS,
  MAX_ROUTING_FEE_CHAINS,
  ROUTING_FEE_ADDRESS,
  ROUTING_FEE_SLIPPAGE_RATIO,
  SWAP_THRESHOLD_TO_GET_CASHBACK,
  TEMPLE_TOKEN
} from 'src/config/swap';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { TokensInputsEnum, useFilteredSwapTokensList } from 'src/hooks/use-filtered-swap-tokens.hook';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { useSwap } from 'src/hooks/use-swap.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { isLiquidityBakingParamsResponse } from 'src/interfaces/route3.interface';
import { SwapFormValues } from 'src/interfaces/swap-asset.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useUsdToTokenRates } from 'src/store/currency/currency-selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import { loadSwapParamsAction } from 'src/store/swap/swap-actions';
import {
  useSwapParamsSelector,
  useSwapTokenBySlugSelector,
  useSwapTokensMetadataSelector
} from 'src/store/swap/swap-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { SIRS_TOKEN } from 'src/token/data/token-slugs';
import { emptyTezosLikeToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { ZERO } from 'src/utils/number.util';
import { fetchRoute3SwapParams, getRoute3TokenSymbol, isInputTokenEqualToTempleToken } from 'src/utils/route3.util';
import {
  calculateFeeFromOutput,
  calculateRoutingInputAndFeeFromInput,
  calculateSlippageRatio,
  getRoutingFeeTransferParams
} from 'src/utils/swap.utils';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { SwapAssetsButton } from './swap-assets-button/swap-assets-button';
import { SwapDisclaimer } from './swap-disclaimer/swap-disclaimer';
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
  const getSwapParams = useSwap();

  const { trackEvent } = useAnalytics();
  const slippageTolerance = useSlippageSelector();
  const tezosToken = useTezosTokenOfCurrentAccount();
  const publicKeyHash = useCurrentAccountPkhSelector();
  const tezos = useReadOnlyTezosToolkit();
  const blockLevel = useBlockLevel();
  const { isLoading } = useSwapTokensMetadataSelector();
  const usdExchangeRates = useUsdToTokenRates();

  const swapParams = useSwapParamsSelector();
  const prevOutputRef = useRef(swapParams.data.output);
  const { input: rawInput, output: rawOutput } = swapParams.data;
  const slippageRatio = useMemo(() => calculateSlippageRatio(slippageTolerance), [slippageTolerance]);

  const handleSubmit = async () => {
    const inputAssetSlug = getTokenSlug(inputAssets.asset);
    const outputAssetSlug = getTokenSlug(outputAssets.asset);
    const { swapInputMinusFeeAtomic, routingFeeFromInputAtomic } = calculateRoutingInputAndFeeFromInput(
      inputAssets.amount
    );
    const routingFeeFromOutputAtomic = calculateFeeFromOutput(inputAssets.amount, minimumReceivedAmountAtomic);

    const analyticsProperties = {
      inputAsset: inputAssetSlug,
      outputAsset: outputAssetSlug
    };

    trackEvent('SWAP_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, analyticsProperties);

    if (!inputAssets.amount || !fromRoute3Token || !toRoute3Token || swapInputMinusFeeAtomic.isEqualTo(ZERO)) {
      return;
    }

    const allSwapParams: Array<TransferParams> = [];
    let routingOutputFeeTransferParams: TransferParams[] = await getRoutingFeeTransferParams(
      toRoute3Token,
      routingFeeFromOutputAtomic,
      publicKeyHash,
      ROUTING_FEE_ADDRESS,
      tezos
    );

    const route3SwapOpParams = await getSwapParams(
      fromRoute3Token,
      toRoute3Token,
      swapInputMinusFeeAtomic,
      minimumReceivedAmountAtomic,
      swapParams.data
    );

    const inputAssetUsdExchangeRate = usdExchangeRates[getTokenSlug(inputAssets.asset)];

    const inputAmountInUsd = mutezToTz(
      swapInputMinusFeeAtomic.plus(routingFeeFromInputAtomic).times(inputAssetUsdExchangeRate),
      fromRoute3Token.decimals
    );

    const isInputTokenTempleToken = isInputTokenEqualToTempleToken(inputAssetSlug);
    const isSwapAmountMoreThreshold = inputAmountInUsd.isGreaterThanOrEqualTo(SWAP_THRESHOLD_TO_GET_CASHBACK);

    if (isInputTokenTempleToken && isSwapAmountMoreThreshold) {
      const routingInputFeeOpParams = await getRoutingFeeTransferParams(
        fromRoute3Token,
        routingFeeFromInputAtomic.dividedToIntegerBy(2),
        publicKeyHash,
        BURN_ADDREESS,
        tezos
      );
      allSwapParams.push(...routingInputFeeOpParams);
    } else if (isInputTokenTempleToken && !isSwapAmountMoreThreshold) {
      const routingInputFeeOpParams = await getRoutingFeeTransferParams(
        TEMPLE_TOKEN,
        routingFeeFromInputAtomic,
        publicKeyHash,
        ROUTING_FEE_ADDRESS,
        tezos
      );
      allSwapParams.push(...routingInputFeeOpParams);
    } else if (!isInputTokenTempleToken && isSwapAmountMoreThreshold && routingFeeFromInputAtomic.gt(0)) {
      const swapToTempleParams = await fetchRoute3SwapParams({
        fromSymbol: fromRoute3Token.symbol,
        toSymbol: TEMPLE_TOKEN.symbol,
        amount: mutezToTz(routingFeeFromInputAtomic, fromRoute3Token.decimals).toFixed(),
        chainsLimit: MAX_ROUTING_FEE_CHAINS
      });

      const templeOutputAtomic = tzToMutez(new BigNumber(swapToTempleParams.output ?? ZERO), TEMPLE_TOKEN.decimals)
        .multipliedBy(ROUTING_FEE_SLIPPAGE_RATIO)
        .integerValue(BigNumber.ROUND_DOWN);

      const swapToTempleTokenOpParams = await getSwapParams(
        fromRoute3Token,
        TEMPLE_TOKEN,
        routingFeeFromInputAtomic,
        templeOutputAtomic,
        swapToTempleParams
      );

      allSwapParams.push(...swapToTempleTokenOpParams);

      const routingFeeOpParams = await getRoutingFeeTransferParams(
        TEMPLE_TOKEN,
        templeOutputAtomic.dividedToIntegerBy(2),
        publicKeyHash,
        BURN_ADDREESS,
        tezos
      );
      allSwapParams.push(...routingFeeOpParams);
    } else if (!isInputTokenTempleToken && isSwapAmountMoreThreshold) {
      const swapToTempleParams = await fetchRoute3SwapParams({
        fromSymbol: toRoute3Token.symbol,
        toSymbol: TEMPLE_TOKEN.symbol,
        amount: mutezToTz(routingFeeFromOutputAtomic, toRoute3Token.decimals).toFixed(),
        chainsLimit: MAX_ROUTING_FEE_CHAINS
      });

      const templeOutputAtomic = tzToMutez(new BigNumber(swapToTempleParams.output ?? ZERO), TEMPLE_TOKEN.decimals)
        .multipliedBy(ROUTING_FEE_SLIPPAGE_RATIO)
        .integerValue(BigNumber.ROUND_DOWN);

      const swapToTempleTokenOpParams = await getSwapParams(
        toRoute3Token,
        TEMPLE_TOKEN,
        routingFeeFromOutputAtomic,
        templeOutputAtomic,
        swapToTempleParams
      );

      const routingFeeOpParams = await getRoutingFeeTransferParams(
        TEMPLE_TOKEN,
        templeOutputAtomic.dividedToIntegerBy(2),
        publicKeyHash,
        BURN_ADDREESS,
        tezos
      );
      routingOutputFeeTransferParams = [...swapToTempleTokenOpParams, ...routingFeeOpParams];
    } else if (!isInputTokenTempleToken && !isSwapAmountMoreThreshold) {
      const routingInputFeeOpParams = await getRoutingFeeTransferParams(
        fromRoute3Token,
        routingFeeFromInputAtomic,
        publicKeyHash,
        ROUTING_FEE_ADDRESS,
        tezos
      );
      allSwapParams.push(...routingInputFeeOpParams);
    }

    allSwapParams.push(...route3SwapOpParams, ...routingOutputFeeTransferParams);

    const opParams: Array<ParamsWithKind> = allSwapParams.map(transferParams => ({
      ...transferParams,
      kind: OpKind.TRANSACTION
    }));

    if (opParams.length === 0) {
      showErrorToast({ description: 'Transaction params not loaded' });
      trackEvent('SWAP_FORM_SUBMIT_FAIL', AnalyticsEventCategory.FormSubmitFail);
    } else {
      trackEvent('SWAP_FORM_SUBMIT_SUCCESS', AnalyticsEventCategory.FormSubmitSuccess);
      dispatch(
        navigateAction(ModalsEnum.Confirmation, {
          type: ConfirmationTypeEnum.InternalOperations,
          opParams,
          testID: 'SWAP_TRANSACTION_SENT'
        })
      );
    }
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

  const minimumReceivedAmountAtomic = useMemo(() => {
    if (isDefined(swapParams.data.output)) {
      return tzToMutez(new BigNumber(swapParams.data.output), outputAssets.asset.decimals)
        .multipliedBy(slippageRatio)
        .integerValue(BigNumber.ROUND_DOWN);
    } else {
      return ZERO;
    }
  }, [swapParams.data.output, inputAssets.asset.decimals, slippageRatio]);

  const inputAssetSlug = tokenEqualityFn(inputAssets.asset, emptyTezosLikeToken)
    ? undefined
    : getTokenSlug(inputAssets.asset);
  const outputAssetSlug = tokenEqualityFn(outputAssets.asset, emptyTezosLikeToken)
    ? undefined
    : getTokenSlug(outputAssets.asset);

  const fromRoute3Token = useSwapTokenBySlugSelector(inputAssetSlug ?? '');
  const toRoute3Token = useSwapTokenBySlugSelector(outputAssetSlug ?? '');

  const { filteredTokensList: fromTokensList, setSearchValue: setSearchValueFromTokens } = useFilteredSwapTokensList(
    TokensInputsEnum.From,
    inputAssetSlug
  );
  const { filteredTokensList: toTokensList, setSearchValue: setSearchValueToTokens } = useFilteredSwapTokensList(
    TokensInputsEnum.To,
    outputAssetSlug
  );

  useEffect(() => {
    if (isDefined(inputAssets.amount)) {
      dispatchLoadSwapParams(inputAssets, outputAssets);
    }
  }, [blockLevel]);

  useEffect(() => {
    const currentOutput = swapParams.data.output;

    if (currentOutput === prevOutputRef.current) {
      return;
    }

    prevOutputRef.current = currentOutput;
    if (currentOutput === undefined) {
      setFieldValue('outputAssets', { asset: outputAssets.asset, amount: undefined });
    } else {
      const outputAtomicAmountPlusFee = tzToMutez(new BigNumber(currentOutput), outputAssets.asset.decimals);
      const feeFromOutput = calculateFeeFromOutput(inputAssets.amount, outputAtomicAmountPlusFee);
      setFieldValue('outputAssets', {
        asset: outputAssets.asset,
        amount: outputAtomicAmountPlusFee.minus(feeFromOutput)
      });
    }
  }, [swapParams.data.output, inputAssets.amount, outputAssets.asset]);

  const handleInputAssetsValueChange = useCallback(
    (newInputValue: AssetAmountInterface) => {
      const isEmptyToken = tokenEqualityFn(newInputValue.asset, emptyTezosLikeToken);

      if (getTokenSlug(newInputValue.asset) === outputAssetSlug && !isEmptyToken) {
        setFieldValue('outputAssets', { asset: emptyTezosLikeToken, amount: undefined });
      }

      dispatchLoadSwapParams(newInputValue, outputAssets);
    },
    [outputAssetSlug, setFieldValue, trackEvent]
  );

  const handleOutputAssetsValueChange = useCallback(
    (newOutputValue: AssetAmountInterface) => {
      if (getTokenSlug(newOutputValue.asset) === inputAssetSlug) {
        setFieldValue('inputAssets', { asset: emptyTezosLikeToken, amount: undefined });
      }

      dispatchLoadSwapParams(inputAssets, newOutputValue);
    },
    [inputAssetSlug, setFieldValue, inputAssets.amount]
  );

  const dispatchLoadSwapParams = useCallback((input: AssetAmountInterface, output: AssetAmountInterface) => {
    const { swapInputMinusFeeAtomic: amount } = calculateRoutingInputAndFeeFromInput(input.amount);

    dispatch(
      loadSwapParamsAction.submit({
        fromSymbol: getRoute3TokenSymbol(input.asset),
        toSymbol: getRoute3TokenSymbol(output.asset),
        amount: mutezToTz(amount, input.asset.decimals).toFixed()
      })
    );
  }, []);

  const chainsAreAbsent = isLiquidityBakingParamsResponse(swapParams.data)
    ? isEmptyArray(swapParams.data.tzbtcChain.chains) && isEmptyArray(swapParams.data.xtzChain.chains)
    : isEmptyArray(swapParams.data.chains);
  const inputAmount = useMemo(() => (isDefined(rawInput) ? new BigNumber(rawInput) : undefined), [rawInput]);
  const outputAmount = useMemo(() => (isDefined(rawOutput) ? new BigNumber(rawOutput) : undefined), [rawOutput]);
  const routingFeeIsTakenFromOutput = inputAssets.amount?.lt(ATOMIC_INPUT_THRESHOLD_FOR_FEE_FROM_INPUT) ?? false;

  return (
    <FormikProvider value={formik}>
      <ScreenContainer>
        <Divider size={formatSize(8)} />

        <FormAssetAmountInput
          name="inputAssets"
          label="From"
          isSearchable
          maxButton
          assetsList={fromTokensList}
          isLoading={isLoading}
          setSearchValue={setSearchValueFromTokens}
          onValueChange={handleInputAssetsValueChange}
          testID={SwapFormSelectors.fromAssetAmountInput}
          tokenTestID={SwapFormSelectors.fromTokenChange}
        />
        <SwapAssetsButton />

        <FormAssetAmountInput
          name="outputAssets"
          label="To"
          selectionOptions={selectionOptions}
          toUsdToggle={false}
          editable={false}
          isSearchable
          assetsList={toTokensList}
          isLoading={isLoading}
          setSearchValue={setSearchValueToTokens}
          onValueChange={handleOutputAssetsValueChange}
          testID={SwapFormSelectors.toAssetAmountInput}
          tokenTestID={SwapFormSelectors.toTokenChange}
        />
        <View>
          <SwapExchangeRate
            inputAsset={inputAssets.asset}
            slippageRatio={slippageRatio}
            outputAsset={outputAssets.asset}
            inputAmount={inputAmount}
            outputAmount={outputAmount}
            routingFeeIsTakenFromOutput={routingFeeIsTakenFromOutput}
          />
          <SwapRoute
            isLbInput={isDefined(inputAssets.asset) && getTokenSlug(inputAssets.asset) === getTokenSlug(SIRS_TOKEN)}
            isLbOutput={isDefined(outputAssets.asset) && getTokenSlug(outputAssets.asset) === getTokenSlug(SIRS_TOKEN)}
            routingFeeIsTakenFromOutput={routingFeeIsTakenFromOutput}
            outputToken={outputAssets.asset}
          />
        </View>

        <SwapDisclaimer />
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          disabled={(submitCount !== 0 && !isValid) || (submitCount !== 0 && chainsAreAbsent) || swapParams.isLoading}
          title={Boolean(swapParams.isLoading) ? 'Searching the best route' : 'Swap'}
          onPress={submitForm}
          testID={SwapFormSelectors.swapButton}
        />
      </ButtonsFloatingContainer>
    </FormikProvider>
  );
};
