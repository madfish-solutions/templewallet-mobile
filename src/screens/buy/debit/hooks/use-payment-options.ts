import { BigNumber } from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PaymentProviderInterface, TopUpInputInterface } from 'src/interfaces/topup.interface';
import { getTezUahPairEstimation } from 'src/utils/alice-bob.utils';
import { makeFiatPurchaseProvidersSortPredicate } from 'src/utils/fiat-purchase-providers.utils';
import { isDefined } from 'src/utils/is-defined';
import { getMoonPayBuyQuote } from 'src/utils/moonpay.utils';
import { convertFiatAmountToCrypto } from 'src/utils/utorg.utils';

import { useInputLimits } from './use-input-limits.hook';

type getOutputAmountFunction = (
  inputAmount: BigNumber,
  inputAssetCode: string,
  outputAssetCode: string
) => Promise<number>;

type PaymentProviderInitialData = Pick<PaymentProviderInterface, 'name' | 'iconName' | 'id' | 'kycRequired'>;

const usePaymentOption = (
  getOutputAmount: getOutputAmountFunction,
  initialData: PaymentProviderInitialData,
  inputAmount: BigNumber | undefined,
  inputAsset: TopUpInputInterface,
  outputAsset: TopUpInputInterface
) => {
  const [outputAmount, setOutputAmount] = useState<number>();
  const [isError, setIsError] = useState(false);
  const [outputAmountLoading, setOutputAmountLoading] = useState<boolean>(false);
  const { minAmount, maxAmount } = useInputLimits(initialData.id, inputAsset.code);

  const updateOutputAmount = useCallback(
    async (newInputAmount?: BigNumber, newInputAsset = inputAsset, newOutputAsset = outputAsset) => {
      setIsError(false);
      if (!isDefined(newInputAmount)) {
        setOutputAmount(undefined);

        return undefined;
      }

      let newOutputAmount: number | undefined;
      try {
        setOutputAmountLoading(true);
        newOutputAmount = await getOutputAmount(newInputAmount, newInputAsset.code, newOutputAsset.code);
      } catch (error) {
        console.error(initialData.id, error);
        setIsError(true);
        newOutputAmount = undefined;
      } finally {
        setOutputAmount(newOutputAmount);
        setOutputAmountLoading(false);
      }

      return newOutputAmount;
    },
    [inputAsset, outputAsset, getOutputAmount]
  );

  const option = useMemo<PaymentProviderInterface>(
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
    option,
    isError,
    updateOutputAmount,
    loading: outputAmountLoading
  };
};

const getOutputAmountFunctions: Record<TopUpProviderEnum, getOutputAmountFunction> = {
  [TopUpProviderEnum.MoonPay]: async (inputAmount, inputAssetCode, outputAssetCode) => {
    const { baseCurrencyAmount, quoteCurrencyAmount, extraFeePercentage, feeAmount, networkFeeAmount, totalAmount } =
      await getMoonPayBuyQuote(outputAssetCode.toLowerCase(), inputAssetCode.toLowerCase(), inputAmount.toNumber());

    if (inputAmount.lt(totalAmount)) {
      const expectedBaseCurrencyAmount = BigNumber.max(
        inputAmount
          .minus(feeAmount)
          .minus(networkFeeAmount)
          .div(1 + extraFeePercentage / 100)
          .decimalPlaces(2)
          .toNumber(),
        0
      );

      return expectedBaseCurrencyAmount.times(quoteCurrencyAmount).div(baseCurrencyAmount).decimalPlaces(6).toNumber();
    }

    return quoteCurrencyAmount;
  },
  [TopUpProviderEnum.Utorg]: async (inputAmount, inputAssetCode, outputAssetCode) =>
    convertFiatAmountToCrypto(inputAmount.toNumber(), inputAssetCode, outputAssetCode),
  [TopUpProviderEnum.AliceBob]: async inputAmount => getTezUahPairEstimation(inputAmount.toNumber())
};

export const initialPaymentOptionsData: Record<TopUpProviderEnum, PaymentProviderInitialData> = {
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
    name: 'Alice-Bob',
    id: TopUpProviderEnum.AliceBob,
    iconName: IconNameEnum.AliceBob,
    kycRequired: false
  }
};

export const usePaymentOptions = (
  inputAmount: BigNumber | undefined,
  inputAsset: TopUpInputInterface,
  outputAsset: TopUpInputInterface
) => {
  const {
    isError: moonPayIsError,
    option: moonPayOption,
    updateOutputAmount: updateMoonPayOutputAmount,
    loading: moonPayLoading
  } = usePaymentOption(
    getOutputAmountFunctions[TopUpProviderEnum.MoonPay],
    initialPaymentOptionsData[TopUpProviderEnum.MoonPay],
    inputAmount,
    inputAsset,
    outputAsset
  );
  const {
    isError: utorgIsError,
    option: utorgOption,
    updateOutputAmount: updateUtorgOutputAmount,
    loading: utorgLoading
  } = usePaymentOption(
    getOutputAmountFunctions[TopUpProviderEnum.Utorg],
    initialPaymentOptionsData[TopUpProviderEnum.Utorg],
    inputAmount,
    inputAsset,
    outputAsset
  );
  const {
    isError: aliceBobIsError,
    option: aliceBobOption,
    updateOutputAmount: updateAliceBobOutputAmount,
    loading: aliceBobLoading
  } = usePaymentOption(
    getOutputAmountFunctions[TopUpProviderEnum.AliceBob],
    initialPaymentOptionsData[TopUpProviderEnum.AliceBob],
    inputAmount,
    inputAsset,
    outputAsset
  );

  const allPaymentOptions = useMemo(
    () => [moonPayOption, utorgOption, aliceBobOption],
    [moonPayOption, utorgOption, aliceBobOption]
  );

  const paymentOptionsToDisplay = useMemo(() => {
    const errorsFlags = [moonPayIsError, utorgIsError, aliceBobIsError];

    const result = allPaymentOptions
      .filter(
        ({ minInputAmount, maxInputAmount }, index) =>
          !errorsFlags[index] && isDefined(minInputAmount) && isDefined(maxInputAmount)
      )
      .sort(makeFiatPurchaseProvidersSortPredicate(allPaymentOptions[0].inputAmount));

    if (result.length < 2) {
      return result;
    }

    let bestPriceOptionIndex = 0;
    for (let i = 1; i < result.length; i++) {
      const currentBestOutput = result[bestPriceOptionIndex].outputAmount ?? 0;
      const currentOutput = result[i].outputAmount ?? 0;
      if (currentOutput > currentBestOutput) {
        bestPriceOptionIndex = i;
      }
    }
    result[bestPriceOptionIndex].isBestPrice = true;

    return result;
  }, [allPaymentOptions, moonPayIsError, utorgIsError, aliceBobIsError]);
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

  return { allPaymentOptions, paymentOptionsToDisplay, updateOutputAmounts, loading };
};
