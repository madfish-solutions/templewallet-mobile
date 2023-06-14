import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PairLimits } from 'src/utils/pair-limits';

import { useSelector } from '../selector';
import { LoadableEntityState } from '../types';
import { PairLimitsRecord } from './state';

export const useFiatCurrenciesSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].data.fiat);

export const useCryptoCurrenciesSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].data.crypto);

export const useProviderCurrenciesErrorSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].error);

export const useAllPairsLimitsSelector = () => useSelector(({ buyWithCreditCard }) => buyWithCreditCard.pairLimits);

export const usePairLimitsByProvidersSelector = (
  fiatSymbol: string,
  cryptoSymbol: string
): PairLimitsRecord | undefined =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.pairLimits[fiatSymbol]?.[cryptoSymbol]);

export const usePairLimitsSelector = (
  fiatSymbol: string,
  cryptoSymbol: string,
  topUpProvider: TopUpProviderEnum
): LoadableEntityState<PairLimits | undefined> =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.pairLimits[fiatSymbol]?.[cryptoSymbol]?.[topUpProvider]);
