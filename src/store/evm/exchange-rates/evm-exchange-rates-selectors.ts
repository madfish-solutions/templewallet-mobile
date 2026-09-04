import { useCallback } from 'react';

import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { getFiatExchangeRate } from 'src/utils/get-fiat-exchange-rate';
import { isDefined } from 'src/utils/is-defined';

import { useSelector } from '../../selector';

const EMPTY_EVM_CHAIN_EXCHANGE_RATES_RECORD: Record<string, number> = {};

export const useEvmChainExchangeRatesSelector = (chainId: number): Record<string, number> =>
  useSelector(({ evmExchangeRates }) => evmExchangeRates.record[chainId]) ?? EMPTY_EVM_CHAIN_EXCHANGE_RATES_RECORD;

export const useEvmAssetExchangeRate = (chainId: number, slug?: string) => {
  const exchangeRates = useEvmChainExchangeRatesSelector(chainId);
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return isDefined(slug) ? getFiatExchangeRate(exchangeRates[slug], fiatToUsdRate) : undefined;
};

export const useEvmAssetExchangeRateGetter = (chainId: number) => {
  const exchangeRates = useEvmChainExchangeRatesSelector(chainId);
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return useCallback(
    (slug: string) => getFiatExchangeRate(exchangeRates[slug], fiatToUsdRate),
    [exchangeRates, fiatToUsdRate]
  );
};
