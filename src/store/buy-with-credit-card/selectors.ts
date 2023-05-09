import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';

import { useSelector } from '../selector';

export const useFiatCurrenciesSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].data.fiat);

export const useCryptoCurrenciesSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].data.crypto);

export const useAllPairsLimitsSelector = () => useSelector(({ buyWithCreditCard }) => buyWithCreditCard.pairLimits);

const useAllProvidersPairLimitsSelector = (fiatSymbol: string, cryptoSymbol: string) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.pairLimits[fiatSymbol]?.[cryptoSymbol]);

export const usePairLimitsSelector = (fiatSymbol: string, cryptoSymbol: string, topUpProvider: TopUpProviderEnum) =>
  useAllProvidersPairLimitsSelector(fiatSymbol, cryptoSymbol)?.[topUpProvider];
