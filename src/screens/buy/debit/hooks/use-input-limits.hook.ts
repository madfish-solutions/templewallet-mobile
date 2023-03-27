import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { useFiatCurrenciesSelector } from 'src/store/buy-with-credit-card/buy-with-credit-card-selectors';

export const useInputLimits = (topUpProvider: TopUpProviderEnum, fiatCurrencyCode: string) => {
  const fiatCurrencies = useFiatCurrenciesSelector(topUpProvider);
  const fiatCurrency = fiatCurrencies.find(({ code }) => code === fiatCurrencyCode);

  return { minAmount: fiatCurrency?.minAmount, maxAmount: fiatCurrency?.maxAmount };
};
