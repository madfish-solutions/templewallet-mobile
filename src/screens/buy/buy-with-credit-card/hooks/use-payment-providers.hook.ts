import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { TopUpInputInterface, TopUpOutputInterface } from 'src/store/buy-with-credit-card/types';
import { getPaymentProvidersToDisplay } from 'src/utils/fiat-purchase-providers.utils';

import { usePaymentProvider } from './use-one-payment-provider.hook';

export const usePaymentProviders = (
  inputAmount: BigNumber | undefined,
  inputAsset: TopUpInputInterface,
  outputAsset: TopUpOutputInterface
) => {
  const {
    provider: moonPayProvider,
    outputAmountLoading: moonPayLoading,
    errors: moonPayErrors,
    updateOutputAmount: updateMoonPayOutputAmount
  } = usePaymentProvider(TopUpProviderEnum.MoonPay, inputAmount, inputAsset, outputAsset);
  const {
    provider: mtPelerinProvider,
    outputAmountLoading: mtPelerinLoading,
    errors: mtPelerinErrors,
    updateOutputAmount: updateMtPelerinOutputAmount
  } = usePaymentProvider(TopUpProviderEnum.MtPelerin, inputAmount, inputAsset, outputAsset);

  const allPaymentProviders = useMemo(() => [moonPayProvider, mtPelerinProvider], [moonPayProvider, mtPelerinProvider]);

  const providersErrors = useMemo(
    () => ({
      [TopUpProviderEnum.MoonPay]: moonPayErrors,
      [TopUpProviderEnum.MtPelerin]: mtPelerinErrors
    }),
    [moonPayErrors, mtPelerinErrors]
  );

  const providersOutputsLoading = useMemo(
    () => ({
      [TopUpProviderEnum.MoonPay]: moonPayLoading,
      [TopUpProviderEnum.MtPelerin]: mtPelerinLoading
    }),
    [moonPayLoading, mtPelerinLoading]
  );

  const paymentProvidersToDisplay = useMemo(
    () => getPaymentProvidersToDisplay(allPaymentProviders, providersErrors, providersOutputsLoading, inputAmount),
    [allPaymentProviders, providersErrors, providersOutputsLoading, inputAmount]
  );

  const updateOutputAmounts = useCallback(
    async (
      newInputAmount: BigNumber | undefined,
      newInputAsset: TopUpInputInterface,
      newOutputAsset: TopUpOutputInterface
    ) => {
      const [moonPayOutputAmount, mtPelerinOutputAmount] = await Promise.all([
        updateMoonPayOutputAmount(newInputAmount, newInputAsset, newOutputAsset),
        updateMtPelerinOutputAmount(newInputAmount, newInputAsset, newOutputAsset)
      ]);

      return {
        [TopUpProviderEnum.MoonPay]: moonPayOutputAmount,
        [TopUpProviderEnum.MtPelerin]: mtPelerinOutputAmount
      };
    },
    [updateMoonPayOutputAmount, updateMtPelerinOutputAmount]
  );
  const loading = moonPayLoading || mtPelerinLoading;

  return { allPaymentProviders, paymentProvidersToDisplay, updateOutputAmounts, loading };
};
