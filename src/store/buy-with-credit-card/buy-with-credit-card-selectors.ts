import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';

import { useSelector } from '../selector';

export const useFiatCurrenciesSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].data.fiat);

export const useCryptoCurrenciesSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].data.crypto);

export const useCurrenciesLoadingSelector = () =>
  useSelector(({ buyWithCreditCard }) =>
    Object.values(buyWithCreditCard.currencies).some(({ isLoading }) => isLoading)
  );
