import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { isTruthy } from 'src/utils/is-truthy';

import { useSelector } from '../selector';

export const useFiatCurrenciesSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].data.fiat);

export const useCryptoCurrenciesSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].data.crypto);

export const useCurrenciesLoadingSelector = () =>
  useSelector(({ buyWithCreditCard }) =>
    Object.values(buyWithCreditCard.currencies).some(({ isLoading }) => isLoading)
  );

export const useCurrenciesErrorSelector = () =>
  useSelector(({ buyWithCreditCard }) => Object.values(buyWithCreditCard.currencies).find(({ error }) => error));

export const useProviderCurrenciesErrorSelector = (topUpProvider: TopUpProviderEnum) =>
  useSelector(({ buyWithCreditCard }) => buyWithCreditCard.currencies[topUpProvider].error);

export const useLocationSelector = () =>
  useSelector(({ buyWithCreditCard }) => {
    const { data } = buyWithCreditCard.location;

    return isTruthy(data.alpha2) ? data : undefined;
  });
