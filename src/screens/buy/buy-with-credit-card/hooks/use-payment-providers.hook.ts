import { BigNumber } from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PaymentProviderInterface, TopUpInputInterface } from 'src/interfaces/topup.interface';
import { useFiatCurrenciesSelector } from 'src/store/buy-with-credit-card/buy-with-credit-card-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import { getTezUahPairEstimation } from 'src/utils/alice-bob.utils';
import { getPaymentProvidersToDisplay } from 'src/utils/fiat-purchase-providers.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { isDefined } from 'src/utils/is-defined';
import { getMoonPayBuyQuote } from 'src/utils/moonpay.utils';
import { convertFiatAmountToCrypto } from 'src/utils/utorg.utils';

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
      await getMoonPayBuyQuote(outputAsset.code.toLowerCase(), inputAsset.code.toLowerCase(), inputAmount.toNumber());

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
  [TopUpProviderEnum.Utorg]: async (inputAmount, inputAsset, outputAsset) =>
    convertFiatAmountToCrypto(inputAmount.toNumber(), inputAsset.code, outputAsset.code),
  [TopUpProviderEnum.AliceBob]: async inputAmount => getTezUahPairEstimation(inputAmount.toNumber())
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
  }
};

const usePaymentProvider = (
  providerId: TopUpProviderEnum,
  inputAmount: BigNumber | undefined,
  inputAsset: TopUpInputInterface,
  outputAsset: TopUpInputInterface
) => {
  const [outputAmount, setOutputAmount] = useState<number>();
  const [isError, setIsError] = useState(false);
  const [outputAmountLoading, setOutputAmountLoading] = useState<boolean>(false);
  const fiatCurrencies = useFiatCurrenciesSelector(providerId);
  const { minAmount, maxAmount } = useInputLimits(providerId, inputAsset.code);
  const initialData = initialPaymentProvidersData[providerId];
  const getOutputAmount = getOutputAmountFunctions[providerId];

  const updateOutputAmount = useCallback(
    async (newInputAmount?: BigNumber, newInputAsset = inputAsset, newOutputAsset = outputAsset) => {
      setIsError(false);
      const currentProviderCurrency = fiatCurrencies.find(({ code }) => code === newInputAsset.code);
      if (
        !isDefined(newInputAmount) ||
        !isDefined(currentProviderCurrency?.minAmount) ||
        !isDefined(currentProviderCurrency?.maxAmount)
      ) {
        setOutputAmount(undefined);

        return undefined;
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
    [inputAsset, outputAsset, getOutputAmount, providerId, fiatCurrencies]
  );

  const provider = useMemo<PaymentProviderInterface>(
    () => ({
      ...initialData,
      isBestPrice: false,
      minInputAmount: minAmount,
      maxInputAmount: maxAmount,
      inputAmount: inputAmount?.toNumber(),
      inputSymbol: inputAsset.code,
      outputAmount,
      outputSymbol: outputAsset.code
    }),
    [initialData, inputAmount, inputAsset, outputAmount, outputAsset, minAmount, maxAmount]
  );

  return {
    provider,
    isError,
    updateOutputAmount,
    loading: outputAmountLoading
  };
};

export const usePaymentProviders = (
  inputAmount: BigNumber | undefined,
  inputAsset: TopUpInputInterface,
  outputAsset: TopUpInputInterface
) => {
  const {
    isError: moonPayIsError,
    provider: moonPayProvider,
    updateOutputAmount: updateMoonPayOutputAmount,
    loading: moonPayLoading
  } = usePaymentProvider(TopUpProviderEnum.MoonPay, inputAmount, inputAsset, outputAsset);
  const {
    isError: utorgIsError,
    provider: utorgProvider,
    updateOutputAmount: updateUtorgOutputAmount,
    loading: utorgLoading
  } = usePaymentProvider(TopUpProviderEnum.Utorg, inputAmount, inputAsset, outputAsset);
  const {
    isError: aliceBobIsError,
    provider: aliceBobProvider,
    updateOutputAmount: updateAliceBobOutputAmount,
    loading: aliceBobLoading
  } = usePaymentProvider(TopUpProviderEnum.AliceBob, inputAmount, inputAsset, outputAsset);

  const allPaymentProviders = useMemo(
    () => [moonPayProvider, utorgProvider, aliceBobProvider],
    [moonPayProvider, utorgProvider, aliceBobProvider]
  );

  const paymentProvidersToDisplay = useMemo(
    () =>
      getPaymentProvidersToDisplay(
        allPaymentProviders,
        {
          [TopUpProviderEnum.MoonPay]: moonPayIsError,
          [TopUpProviderEnum.Utorg]: utorgIsError,
          [TopUpProviderEnum.AliceBob]: aliceBobIsError
        },
        {
          [TopUpProviderEnum.MoonPay]: moonPayLoading,
          [TopUpProviderEnum.Utorg]: utorgLoading,
          [TopUpProviderEnum.AliceBob]: aliceBobLoading
        },
        inputAmount
      ),
    [allPaymentProviders, moonPayIsError, utorgIsError, aliceBobIsError, moonPayLoading, utorgLoading, aliceBobLoading]
  );
  const updateOutputAmounts = useCallback(
    async (newInputAmount?: BigNumber, newInputAsset = inputAsset, newOutputAsset = outputAsset) => {
      const [moonPayOutputAmount, utorgOutputAmount, aliceBobOutputAmount] = await Promise.all([
        updateMoonPayOutputAmount(newInputAmount, newInputAsset, newOutputAsset),
        updateUtorgOutputAmount(newInputAmount, newInputAsset, newOutputAsset),
        updateAliceBobOutputAmount(newInputAmount, newInputAsset, newOutputAsset)
      ]);

      return {
        [TopUpProviderEnum.MoonPay]: moonPayOutputAmount,
        [TopUpProviderEnum.Utorg]: utorgOutputAmount,
        [TopUpProviderEnum.AliceBob]: aliceBobOutputAmount
      };
    },
    [inputAsset, outputAsset, updateMoonPayOutputAmount, updateUtorgOutputAmount, updateAliceBobOutputAmount]
  );
  const loading = moonPayLoading || utorgLoading || aliceBobLoading;

  return { allPaymentProviders, paymentProvidersToDisplay, updateOutputAmounts, loading };
};
