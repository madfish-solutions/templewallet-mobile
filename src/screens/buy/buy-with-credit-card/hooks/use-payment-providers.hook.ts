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

  const allPaymentProviders = useMemo(
    () => [moonPayProvider, utorgProvider, aliceBobProvider],
    [moonPayProvider, utorgProvider, aliceBobProvider]
  );

  const providersErrors = useMemo(
    () => ({
      [TopUpProviderEnum.MoonPay]: moonPayErrors,
      [TopUpProviderEnum.Utorg]: utorgErrors,
      [TopUpProviderEnum.AliceBob]: aliceBobErrors
    }),
    [moonPayErrors, utorgErrors, aliceBobErrors]
  );

  const providersOutputsLoading = useMemo(
    () => ({
      [TopUpProviderEnum.MoonPay]: moonPayLoading,
      [TopUpProviderEnum.Utorg]: utorgLoading,
      [TopUpProviderEnum.AliceBob]: aliceBobLoading
    }),
    [moonPayLoading, utorgLoading, aliceBobLoading]
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
    [updateMoonPayOutputAmount, updateUtorgOutputAmount, updateAliceBobOutputAmount]
  );
  const loading = moonPayLoading || utorgLoading || aliceBobLoading;

  return { allPaymentProviders, paymentProvidersToDisplay, updateOutputAmounts, loading };
};
