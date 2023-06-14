import { BigNumber } from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getTezUahPairEstimation } from 'src/apis/alice-bob';
import { getMoonPayBuyQuote } from 'src/apis/moonpay';
import { estimateBinanceConnectOutput } from 'src/apis/temple-static';
import { convertFiatAmountToCrypto } from 'src/apis/utorg';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { ProviderErrors } from 'src/interfaces/buy-with-card';
import { PaymentProviderInterface } from 'src/interfaces/payment-provider';
import { updateTopUpProviderPairLimitsAction } from 'src/store/buy-with-credit-card/actions';
import {
  useCryptoCurrenciesSelector,
  useFiatCurrenciesSelector,
  useProviderCurrenciesErrorSelector
} from 'src/store/buy-with-credit-card/selectors';
import { TopUpInputInterface } from 'src/store/buy-with-credit-card/types';
import { showErrorToast } from 'src/toast/toast.utils';
import { getPaymentProvidersToDisplay } from 'src/utils/fiat-purchase-providers.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { getUpdatedFiatLimits } from 'src/utils/get-updated-fiat-limits.utils';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';

import { useInputLimits } from './use-input-limits.hook';

type getOutputAmountFunction = (
  inputAmount: BigNumber,
  inputAsset: TopUpInputInterface,
  outputAsset: TopUpInputInterface
) => Promise<number>;

type PaymentProviderInitialData = Pick<PaymentProviderInterface, 'name' | 'iconName' | 'id' | 'kycRequired'>;

const getOutputAmountFunctions: Record<TopUpProviderEnum, getOutputAmountFunction> = {
  [TopUpProviderEnum.MoonPay]: async (inputAmount, inputAsset, outputAsset) => {
    const { baseCurrencyAmount, quoteCurrencyAmount, extraFeePercentage, feeAmount, networkFeeAmount, totalAmount } =
      await getMoonPayBuyQuote(outputAsset.code.toLowerCase(), inputAsset.code.toLowerCase(), inputAmount.toString());

    if (inputAmount.lt(totalAmount)) {
      const expectedBaseCurrencyAmount = BigNumber.max(
        inputAmount
          .minus(feeAmount)
          .minus(networkFeeAmount)
          .div(1 + extraFeePercentage / 100)
          .decimalPlaces(inputAsset.precision ?? 0, BigNumber.ROUND_DOWN),
        0
      );

      return expectedBaseCurrencyAmount
        .times(quoteCurrencyAmount)
        .div(baseCurrencyAmount)
        .decimalPlaces(outputAsset.precision ?? 0, BigNumber.ROUND_DOWN)
        .toNumber();
    }

    return quoteCurrencyAmount;
  },
  [TopUpProviderEnum.Utorg]: (inputAmount, inputAsset, outputAsset) =>
    convertFiatAmountToCrypto(inputAsset.code, outputAsset.code, inputAmount.toNumber()),
  [TopUpProviderEnum.AliceBob]: inputAmount => getTezUahPairEstimation(inputAmount.toNumber()),
  [TopUpProviderEnum.BinanceConnect]: (inputAmount, inputAsset, outputAsset) =>
    estimateBinanceConnectOutput(inputAsset.code, outputAsset.code, String(inputAmount))
};

const initialPaymentProvidersData: Record<TopUpProviderEnum, PaymentProviderInitialData> = {
  [TopUpProviderEnum.MoonPay]: {
    name: 'MoonPay',
    id: TopUpProviderEnum.MoonPay,
    iconName: IconNameEnum.MoonPay,
    kycRequired: true
  },
  [TopUpProviderEnum.Utorg]: {
    name: 'Utorg',
    id: TopUpProviderEnum.Utorg,
    iconName: IconNameEnum.Utorg,
    kycRequired: true
  },
  [TopUpProviderEnum.AliceBob]: {
    name: 'Alice&Bob',
    id: TopUpProviderEnum.AliceBob,
    iconName: IconNameEnum.AliceBob,
    kycRequired: false
  },
  [TopUpProviderEnum.BinanceConnect]: {
    name: 'Binance Connect',
    id: TopUpProviderEnum.BinanceConnect,
    iconName: IconNameEnum.Binance,
    kycRequired: true
  }
};

const usePaymentProvider = (
  providerId: TopUpProviderEnum,
  inputAmount: BigNumber | undefined,
  inputAsset: TopUpInputInterface,
  outputAsset: TopUpInputInterface
) => {
  const [outputAmount, setOutputAmount] = useState<number>();
  const [isOutputError, setIsError] = useState(false);
  const [outputAmountLoading, setOutputAmountLoading] = useState<boolean>(false);
  const fiatCurrencies = useFiatCurrenciesSelector(providerId);
  const cryptoCurrencies = useCryptoCurrenciesSelector(providerId);
  const currenciesError = useProviderCurrenciesErrorSelector(providerId);
  const { min: minInputAmount, max: maxInputAmount } = useInputLimits(providerId, inputAsset.code, outputAsset.code);
  const initialData = initialPaymentProvidersData[providerId];
  const getOutputAmount = getOutputAmountFunctions[providerId];
  const dispatch = useDispatch();

  const updateOutputAmount = useCallback(
    async (
      newInputAmount: BigNumber | undefined,
      newInputAsset: TopUpInputInterface,
      newOutputAsset: TopUpInputInterface
    ) => {
      setIsError(false);
      const currentProviderFiatCurrency = fiatCurrencies.find(({ code }) => code === newInputAsset.code);
      const currentProviderCryptoCurrency = cryptoCurrencies.find(({ code }) => code === newOutputAsset.code);
      const updatedPairLimits =
        isDefined(currentProviderFiatCurrency) && isDefined(currentProviderCryptoCurrency)
          ? (await getUpdatedFiatLimits(currentProviderFiatCurrency, currentProviderCryptoCurrency, providerId)).data
          : undefined;

      if (isDefined(updatedPairLimits)) {
        dispatch(
          updateTopUpProviderPairLimitsAction({
            fiatSymbol: newInputAsset.code,
            cryptoSymbol: newOutputAsset.code,
            topUpProvider: providerId,
            value: updatedPairLimits
          })
        );
      }

      if (
        !isTruthy(newInputAmount) ||
        !isDefined(updatedPairLimits) ||
        newInputAmount.lt(updatedPairLimits.min) ||
        newInputAmount.gt(updatedPairLimits.max)
      ) {
        const newOutputAmount = isDefined(newInputAmount) && newInputAmount?.isZero() ? 0 : undefined;
        setOutputAmount(newOutputAmount);

        return newOutputAmount;
      }

      let newOutputAmount: number | undefined;
      try {
        setOutputAmountLoading(true);
        newOutputAmount = await getOutputAmount(newInputAmount, newInputAsset, newOutputAsset);
      } catch (error) {
        showErrorToast({ description: getAxiosQueryErrorMessage(error) });
        setIsError(true);
        newOutputAmount = undefined;
      } finally {
        setOutputAmount(newOutputAmount);
        setOutputAmountLoading(false);
      }

      return newOutputAmount;
    },
    [getOutputAmount, providerId, fiatCurrencies, cryptoCurrencies, dispatch]
  );

  const provider = useMemo<PaymentProviderInterface>(
    () => ({
      ...initialData,
      isBestPrice: false,
      minInputAmount,
      maxInputAmount,
      inputAmount: inputAmount?.toNumber(),
      inputSymbol: inputAsset.codeToDisplay ?? inputAsset.code,
      outputAmount,
      outputSymbol: outputAsset.codeToDisplay ?? outputAsset.code
    }),
    [initialData, inputAmount, inputAsset, outputAmount, outputAsset, minInputAmount, maxInputAmount]
  );

  const errors: ProviderErrors = useMemo(
    () => ({
      currencies: currenciesError,
      output: isOutputError
    }),
    [currenciesError, isOutputError]
  );

  return {
    provider,
    errors,
    loading: outputAmountLoading,
    updateOutputAmount
  };
};

export const usePaymentProviders = (
  inputAmount: BigNumber | undefined,
  inputAsset: TopUpInputInterface,
  outputAsset: TopUpInputInterface
) => {
  const {
    provider: moonPayProvider,
    loading: moonPayLoading,
    errors: moonPayErrors,
    updateOutputAmount: updateMoonPayOutputAmount
  } = usePaymentProvider(TopUpProviderEnum.MoonPay, inputAmount, inputAsset, outputAsset);
  const {
    provider: utorgProvider,
    loading: utorgLoading,
    errors: utorgErrors,
    updateOutputAmount: updateUtorgOutputAmount
  } = usePaymentProvider(TopUpProviderEnum.Utorg, inputAmount, inputAsset, outputAsset);
  const {
    provider: aliceBobProvider,
    loading: aliceBobLoading,
    errors: aliceBobErrors,
    updateOutputAmount: updateAliceBobOutputAmount
  } = usePaymentProvider(TopUpProviderEnum.AliceBob, inputAmount, inputAsset, outputAsset);
  const {
    provider: binanceConnectProvider,
    loading: binanceConnectLoading,
    errors: binanceConnectErrors,
    updateOutputAmount: updateBinanceConnectOutputAmount
  } = usePaymentProvider(TopUpProviderEnum.BinanceConnect, inputAmount, inputAsset, outputAsset);

  const allPaymentProviders = useMemo(
    () => [moonPayProvider, utorgProvider, aliceBobProvider, binanceConnectProvider],
    [moonPayProvider, utorgProvider, aliceBobProvider, binanceConnectProvider]
  );

  const providersErrors = useMemo(
    () => ({
      [TopUpProviderEnum.MoonPay]: moonPayErrors,
      [TopUpProviderEnum.Utorg]: utorgErrors,
      [TopUpProviderEnum.AliceBob]: aliceBobErrors,
      [TopUpProviderEnum.BinanceConnect]: binanceConnectErrors
    }),
    [moonPayErrors, utorgErrors, aliceBobErrors, binanceConnectErrors]
  );

  const providersLoading = useMemo(
    () => ({
      [TopUpProviderEnum.MoonPay]: moonPayLoading,
      [TopUpProviderEnum.Utorg]: utorgLoading,
      [TopUpProviderEnum.AliceBob]: aliceBobLoading,
      [TopUpProviderEnum.BinanceConnect]: binanceConnectLoading
    }),
    [moonPayLoading, utorgLoading, aliceBobLoading, binanceConnectLoading]
  );

  const paymentProvidersToDisplay = useMemo(
    () => getPaymentProvidersToDisplay(allPaymentProviders, providersErrors, providersLoading, inputAmount),
    [allPaymentProviders, providersErrors, providersLoading, inputAmount]
  );

  const updateOutputAmounts = useCallback(
    async (
      newInputAmount: BigNumber | undefined,
      newInputAsset: TopUpInputInterface,
      newOutputAsset: TopUpInputInterface
    ) => {
      const [moonPayOutputAmount, utorgOutputAmount, aliceBobOutputAmount, binanceConnectOutputAmount] =
        await Promise.all([
          updateMoonPayOutputAmount(newInputAmount, newInputAsset, newOutputAsset),
          updateUtorgOutputAmount(newInputAmount, newInputAsset, newOutputAsset),
          updateAliceBobOutputAmount(newInputAmount, newInputAsset, newOutputAsset),
          updateBinanceConnectOutputAmount(newInputAmount, newInputAsset, newOutputAsset)
        ]);

      return {
        [TopUpProviderEnum.MoonPay]: moonPayOutputAmount,
        [TopUpProviderEnum.Utorg]: utorgOutputAmount,
        [TopUpProviderEnum.AliceBob]: aliceBobOutputAmount,
        [TopUpProviderEnum.BinanceConnect]: binanceConnectOutputAmount
      };
    },
    [updateMoonPayOutputAmount, updateUtorgOutputAmount, updateAliceBobOutputAmount, updateBinanceConnectOutputAmount]
  );
  const loading = moonPayLoading || utorgLoading || aliceBobLoading;

  return { allPaymentProviders, paymentProvidersToDisplay, updateOutputAmounts, loading };
};
