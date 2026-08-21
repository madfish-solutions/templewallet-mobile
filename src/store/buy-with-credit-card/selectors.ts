import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PairLimits } from 'src/utils/pair-limits';

import { useSelector } from '../selector';
import { LoadableEntityState } from '../types';

import { PairLimitsRecord } from './state';

export const useFiatCurrenciesSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].data.fiat);

export const useCryptoCurrenciesSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].data.crypto);

const useCurrenciesByProviderLoadingSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].isLoading);

export const useCurrenciesLoadingSelector = () => {
  const moonPayLoading = useCurrenciesByProviderLoadingSelector(TopUpProviderEnum.MoonPay);
  const mtPelerinLoading = useCurrenciesByProviderLoadingSelector(TopUpProviderEnum.MtPelerin);

  return moonPayLoading || mtPelerinLoading;
};
export const useProviderCurrenciesErrorSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].error);

export const useAllPairsLimitsSelector = () => useSelector(({ buyWithCreditCard }) => buyWithCreditCard.pairLimits);

export const usePairLimitsByProvidersSelector = (
  fiatSymbol: string,
  cryptoSlug: string
): PairLimitsRecord | undefined =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.pairLimits[fiatSymbol]?.[cryptoSlug]);

export const usePairLimitsSelector = (
  fiatSymbol: string,
  cryptoSlug: string,
  topUpProvider: TopUpProviderEnum
): LoadableEntityState<PairLimits | undefined> =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.pairLimits[fiatSymbol]?.[cryptoSlug]?.[topUpProvider]);

export const useProviderPairLimitsErrorSelector = (
  fiatSymbol: string,
  cryptoSlug: string,
  topUpProvider: TopUpProviderEnum
): string | undefined =>
  useSelector(
    ({ buyWithCreditCard }) => buyWithCreditCard.pairLimits[fiatSymbol]?.[cryptoSlug]?.[topUpProvider]?.error
  );
