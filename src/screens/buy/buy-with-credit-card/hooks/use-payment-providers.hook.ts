import { BigNumber } from 'bignumber.js';
import { useCallback, useMemo } from 'react';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { TopUpInputInterface } from 'src/store/buy-with-credit-card/types';
import { getPaymentProvidersToDisplay } from 'src/utils/fiat-purchase-providers.utils';

import { usePaymentProvider } from './use-one-payment-provider.hook';

export const usePaymentProviders = (
  inputAmount: BigNumber | undefined,
  inputAsset: TopUpInputInterface,
  outputAsset: TopUpInputInterface
) => {
  const {
    provider: moonPayProvider,
    outputAmountLoading: moonPayLoading,
    errors: moonPayErrors,
    updateOutputAmount: updateMoonPayOutputAmount
  } = usePaymentProvider(TopUpProviderEnum.MoonPay, inputAmount, inputAsset, outputAsset);
  const {
    provider: utorgProvider,
    outputAmountLoading: utorgLoading,
    errors: utorgErrors,
    updateOutputAmount: updateUtorgOutputAmount
  } = usePaymentProvider(TopUpProviderEnum.Utorg, inputAmount, inputAsset, outputAsset);
  const {
    provider: aliceBobProvider,
    outputAmountLoading: aliceBobLoading,
    errors: aliceBobErrors,
    updateOutputAmount: updateAliceBobOutputAmount
  } = usePaymentProvider(TopUpProviderEnum.AliceBob, inputAmount, inputAsset, outputAsset);
  const {
    provider: binanceConnectProvider,
    outputAmountLoading: binanceConnectLoading,
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

  const providersOutputsLoading = useMemo(
    () => ({
      [TopUpProviderEnum.MoonPay]: moonPayLoading,
      [TopUpProviderEnum.Utorg]: utorgLoading,
      [TopUpProviderEnum.AliceBob]: aliceBobLoading,
      [TopUpProviderEnum.BinanceConnect]: binanceConnectLoading
    }),
    [moonPayLoading, utorgLoading, aliceBobLoading, binanceConnectLoading]
  );

  const paymentProvidersToDisplay = useMemo(
    () => getPaymentProvidersToDisplay(allPaymentProviders, providersErrors, providersOutputsLoading, inputAmount),
    [allPaymentProviders, providersErrors, providersOutputsLoading, inputAmount]
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
  const loading = moonPayLoading || utorgLoading || aliceBobLoading || binanceConnectLoading;

  return { allPaymentProviders, paymentProvidersToDisplay, updateOutputAmounts, loading };
};
