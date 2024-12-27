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
  CASHBACK_RATIO,
  CASHBACK_SWAP_MAX_DEXES,
  MAIN_NON_SIRS_SWAP_MAX_DEXES,
  MAIN_SIRS_SWAP_MAX_DEXES,
  ROUTING_FEE_ADDRESS,
  ROUTING_FEE_RATIO,
  ROUTING_FEE_SLIPPAGE_RATIO,
  SWAP_THRESHOLD_TO_GET_CASHBACK,
  TEMPLE_TOKEN
} from 'src/config/swap';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { useCanUseOnRamp } from 'src/hooks/use-can-use-on-ramp.hook';
import { TokensInputsEnum, useFilteredSwapTokensList } from 'src/hooks/use-filtered-swap-tokens.hook';
import { useOnRampContinueOverlay } from 'src/hooks/use-on-ramp-continue-overlay.hook';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { useSwap } from 'src/hooks/use-swap.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { isLiquidityBakingParamsResponse } from 'src/interfaces/route3.interface';
import { SwapFormValues } from 'src/interfaces/swap-asset.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { OnRampOverlay } from 'src/screens/wallet/on-ramp-overlay/on-ramp-overlay';
import { useUsdToTokenRates } from 'src/store/currency/currency-selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import { loadSwapParamsAction } from 'src/store/swap/swap-actions';
import {
  useSwapParamsSelector,
  useSwapTokenBySlugSelector,
  useSwapTokensMetadataSelector
} from 'src/store/swap/swap-selectors';
import { useCurrentAccountPkhSelector, useCurrentAccountTezosBalance } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { TEMPLE_TOKEN_SLUG } from 'src/token/data/token-slugs';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { emptyTezosLikeToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { BURN_ADDRESS } from 'src/utils/known-addresses';
import { ZERO } from 'src/utils/number.util';
import { fetchRoute3SwapParams, getRoute3TokenSymbol, isSirsSwap } from 'src/utils/route3.util';
import {
  calculateSidePaymentsFromInput,
  calculateOutputFeeAtomic,
  calculateSlippageRatio,
  getRoutingFeeTransferParams,
  multiplyAtomicAmount,
  calculateOutputAmounts
} from 'src/utils/swap.utils';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { SwapAssetsButton } from './swap-assets-button/swap-assets-button';
import { SwapDisclaimer } from './swap-disclaimer/swap-disclaimer';
import { SwapExchangeRate } from './swap-exchange-rate/swap-exchange-rate';
import { swapFormValidationSchema } from './swap-form.form';
import { SwapFormSelectors } from './swap-form.selectors';

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
  const tezosBalance = useCurrentAccountTezosBalance();
  const blockLevel = useBlockLevel();
  const prevBlockLevelRef = useRef(blockLevel);
  const { isLoading } = useSwapTokensMetadataSelector();
  const usdExchangeRates = useUsdToTokenRates();
  const canUseOnRamp = useCanUseOnRamp();
  const { isOpened: onRampOverlayIsOpened, onClose: onOnRampOverlayClose } = useOnRampContinueOverlay();

  const swapParams = useSwapParamsSelector();
  const prevOutputRef = useRef(swapParams.data.output);
  const { input: rawInput, output: rawOutput } = swapParams.data;
  const slippageRatio = useMemo(() => calculateSlippageRatio(slippageTolerance), [slippageTolerance]);

  const getSwapWithFeeParams = useCallback(
    (newInputValue: AssetAmountInterface, newOutputValue: AssetAmountInterface) => {
      const { asset: inputAsset, amount: inputAmount } = newInputValue;
      const inputAssetSlug = getTokenSlug(inputAsset);
      const outputAssetSlug = getTokenSlug(newOutputValue.asset);
      const inputTokenExchangeRate = inputAssetSlug ? usdExchangeRates[inputAssetSlug] : '0';
      const inputAmountInUsd = inputAmount
        ? mutezToTz(inputAmount, inputAsset.decimals).multipliedBy(inputTokenExchangeRate)
        : ZERO;

      const isInputTokenTempleToken = inputAssetSlug === TEMPLE_TOKEN_SLUG;
      const isOutputTokenTempleToken = outputAssetSlug === TEMPLE_TOKEN_SLUG;
      const isSwapAmountMoreThreshold = inputAmountInUsd.isGreaterThanOrEqualTo(SWAP_THRESHOLD_TO_GET_CASHBACK);
      const mainSwapMaxDexes = isSirsSwap(inputAsset, newOutputValue.asset)
        ? MAIN_SIRS_SWAP_MAX_DEXES
        : MAIN_NON_SIRS_SWAP_MAX_DEXES;

      return {
        isInputTokenTempleToken,
        isOutputTokenTempleToken,
        isSwapAmountMoreThreshold,
        mainSwapMaxDexes
      };
    },
    [usdExchangeRates]
  );

  const handleSubmit = async () => {
    const inputAssetSlug = getTokenSlug(inputAssets.asset);
    const outputAssetSlug = getTokenSlug(outputAssets.asset);
    const {
      swapInputMinusFeeAtomic,
      inputFeeAtomic: routingFeeFromInputAtomic,
      cashbackSwapInputAtomic: cashbackSwapInputFromInAtomic
    } = calculateSidePaymentsFromInput(inputAssets.amount);
    const routingFeeFromOutputAtomic = calculateOutputFeeAtomic(inputAssets.amount, minimumReceivedAtomic);

    const analyticsProperties = {
      inputAsset: inputAssetSlug,
      outputAsset: outputAssetSlug
    };

    trackEvent('SWAP_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, analyticsProperties);

    if (!inputAssets.amount || !fromRoute3Token || !toRoute3Token || swapInputMinusFeeAtomic.isEqualTo(ZERO)) {
      return;
    }

    if (inputAssetSlug === TEZ_TOKEN_SLUG && inputAssets.amount.isGreaterThan(tezosBalance) && canUseOnRamp) {
      dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Continue));

      return;
    }

    const allSwapParams: Array<TransferParams> = [];
    let routingOutputFeeTransferParams: TransferParams[] = await getRoutingFeeTransferParams(
      toRoute3Token,
      outputFeeAtomicAmount,
      publicKeyHash,
      ROUTING_FEE_ADDRESS,
      tezos
    );

    const route3SwapOpParams = await getSwapParams(
      fromRoute3Token,
      toRoute3Token,
      swapInputMinusFeeAtomic,
      outputAtomicAmountBeforeFee,
      slippageRatio,
      swapParams.data
    );

    const { isInputTokenTempleToken, isOutputTokenTempleToken, isSwapAmountMoreThreshold } = getSwapWithFeeParams(
      inputAssets,
      outputAssets
    );

    if (isInputTokenTempleToken && isSwapAmountMoreThreshold) {
      const routingInputFeeOpParams = await getRoutingFeeTransferParams(
        fromRoute3Token,
        routingFeeFromInputAtomic.minus(cashbackSwapInputFromInAtomic),
        publicKeyHash,
        BURN_ADDRESS,
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
        toTokenDecimals: TEMPLE_TOKEN.decimals,
        amount: mutezToTz(routingFeeFromInputAtomic, fromRoute3Token.decimals).toFixed(),
        dexesLimit: CASHBACK_SWAP_MAX_DEXES,
        rpcUrl: tezos.rpc.getRpcUrl()
      });

      const templeExpectedOutputAtomic = tzToMutez(
        new BigNumber(swapToTempleParams.output ?? ZERO),
        TEMPLE_TOKEN.decimals
      );
      const templeMinOutputAtomic = multiplyAtomicAmount(
        templeExpectedOutputAtomic,
        ROUTING_FEE_SLIPPAGE_RATIO,
        BigNumber.ROUND_DOWN
      );

      const swapToTempleTokenOpParams = await getSwapParams(
        fromRoute3Token,
        TEMPLE_TOKEN,
        routingFeeFromInputAtomic,
        templeExpectedOutputAtomic,
        ROUTING_FEE_SLIPPAGE_RATIO,
        swapToTempleParams
      );

      allSwapParams.push(...swapToTempleTokenOpParams);

      const routingFeeOpParams = await getRoutingFeeTransferParams(
        TEMPLE_TOKEN,
        templeMinOutputAtomic.times(ROUTING_FEE_RATIO - CASHBACK_RATIO).dividedToIntegerBy(ROUTING_FEE_RATIO),
        publicKeyHash,
        BURN_ADDRESS,
        tezos
      );
      allSwapParams.push(...routingFeeOpParams);
    } else if (!isInputTokenTempleToken && isSwapAmountMoreThreshold && isOutputTokenTempleToken) {
      routingOutputFeeTransferParams = await getRoutingFeeTransferParams(
        TEMPLE_TOKEN,
        routingFeeFromOutputAtomic.times(ROUTING_FEE_RATIO - CASHBACK_RATIO).dividedToIntegerBy(ROUTING_FEE_RATIO),
        publicKeyHash,
        BURN_ADDRESS,
        tezos
      );
    } else if (!isInputTokenTempleToken && isSwapAmountMoreThreshold) {
      const swapToTempleParams = await fetchRoute3SwapParams({
        fromSymbol: toRoute3Token.symbol,
        toSymbol: TEMPLE_TOKEN.symbol,
        toTokenDecimals: TEMPLE_TOKEN.decimals,
        amount: mutezToTz(routingFeeFromOutputAtomic, toRoute3Token.decimals).toFixed(),
        dexesLimit: CASHBACK_SWAP_MAX_DEXES,
        rpcUrl: tezos.rpc.getRpcUrl()
      });

      const templeExpectedOutputAtomic = tzToMutez(
        new BigNumber(swapToTempleParams.output ?? ZERO),
        TEMPLE_TOKEN.decimals
      );
      const templeMinOutputAtomic = multiplyAtomicAmount(
        templeExpectedOutputAtomic,
        ROUTING_FEE_SLIPPAGE_RATIO,
        BigNumber.ROUND_DOWN
      );

      const swapToTempleTokenOpParams = await getSwapParams(
        toRoute3Token,
        TEMPLE_TOKEN,
        routingFeeFromOutputAtomic,
        templeExpectedOutputAtomic,
        ROUTING_FEE_SLIPPAGE_RATIO,
        swapToTempleParams
      );

      const routingFeeOpParams = await getRoutingFeeTransferParams(
        TEMPLE_TOKEN,
        templeMinOutputAtomic.times(ROUTING_FEE_RATIO - CASHBACK_RATIO).dividedToIntegerBy(ROUTING_FEE_RATIO),
        publicKeyHash,
        BURN_ADDRESS,
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

  const { values, setFieldValue, isValid, submitForm, submitCount, isSubmitting } = formik;
  const { inputAssets, outputAssets } = values;
  const { outputAtomicAmountBeforeFee, minimumReceivedAtomic, outputFeeAtomicAmount } = useMemo(
    () =>
      calculateOutputAmounts(
        inputAssets.amount,
        inputAssets.asset.decimals,
        swapParams.data.output,
        outputAssets.asset.decimals,
        slippageRatio
      ),
    [inputAssets, swapParams, outputAssets.asset.decimals, slippageRatio]
  );

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

  const dispatchLoadSwapParams = useCallback(
    (input: AssetAmountInterface, output: AssetAmountInterface) => {
      const { swapInputMinusFeeAtomic: amount } = calculateSidePaymentsFromInput(input.amount);
      const { mainSwapMaxDexes } = getSwapWithFeeParams(input, output);

      dispatch(
        loadSwapParamsAction.submit({
          fromSymbol: getRoute3TokenSymbol(input.asset),
          toSymbol: getRoute3TokenSymbol(output.asset),
          toTokenDecimals: output.asset.decimals,
          amount: mutezToTz(amount, input.asset.decimals).toFixed(),
          dexesLimit: mainSwapMaxDexes,
          rpcUrl: tezos.rpc.getRpcUrl()
        })
      );
    },
    [dispatch, getSwapWithFeeParams, tezos.rpc]
  );

  useEffect(() => {
    if (isDefined(inputAssets.amount) && prevBlockLevelRef.current !== blockLevel) {
      dispatchLoadSwapParams(inputAssets, outputAssets);
    }
    prevBlockLevelRef.current = blockLevel;
  }, [blockLevel, dispatchLoadSwapParams, inputAssets, outputAssets]);

  useEffect(() => {
    const currentOutput = swapParams.data.output;

    if (currentOutput === prevOutputRef.current) {
      return;
    }

    prevOutputRef.current = currentOutput;
    if (currentOutput === undefined) {
      setFieldValue('outputAssets', { asset: outputAssets.asset, amount: undefined });
    } else {
      const { expectedReceivedAtomic } = calculateOutputAmounts(
        inputAssets.amount,
        inputAssets.asset.decimals,
        currentOutput,
        outputAssets.asset.decimals,
        slippageRatio
      );
      setFieldValue('outputAssets', {
        asset: outputAssets.asset,
        amount: expectedReceivedAtomic
      });
    }
  }, [swapParams.data.output, inputAssets, outputAssets.asset, setFieldValue, slippageRatio]);

  const handleInputAssetsValueChange = useCallback(
    (newInputValue: AssetAmountInterface) => {
      const isEmptyToken = tokenEqualityFn(newInputValue.asset, emptyTezosLikeToken);

      if (getTokenSlug(newInputValue.asset) === outputAssetSlug && !isEmptyToken) {
        setFieldValue('outputAssets', { asset: emptyTezosLikeToken, amount: undefined });
      }

      dispatchLoadSwapParams(newInputValue, outputAssets);
    },
    [dispatchLoadSwapParams, outputAssetSlug, outputAssets, setFieldValue]
  );

  const handleOutputAssetsValueChange = useCallback(
    (newOutputValue: AssetAmountInterface) => {
      if (getTokenSlug(newOutputValue.asset) === inputAssetSlug) {
        setFieldValue('inputAssets', { asset: emptyTezosLikeToken, amount: undefined });
      }

      dispatchLoadSwapParams(inputAssets, newOutputValue);
    },
    [inputAssetSlug, dispatchLoadSwapParams, inputAssets, setFieldValue]
  );

  const chainsAreAbsent = isLiquidityBakingParamsResponse(swapParams.data)
    ? isEmptyArray(swapParams.data.tzbtcHops) && isEmptyArray(swapParams.data.xtzHops)
    : isEmptyArray(swapParams.data.hops);
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
        </View>

        <SwapDisclaimer />
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          disabled={
            (submitCount !== 0 && !isValid) ||
            (submitCount !== 0 && chainsAreAbsent) ||
            swapParams.isLoading ||
            isSubmitting
          }
          title={Boolean(swapParams.isLoading) ? 'Searching the best route' : 'Swap'}
          onPress={submitForm}
          testID={SwapFormSelectors.swapButton}
        />
      </ButtonsFloatingContainer>

      <OnRampOverlay isStart={false} onClose={onOnRampOverlayClose} isOpen={onRampOverlayIsOpened} />
    </FormikProvider>
  );
};
