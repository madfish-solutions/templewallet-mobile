import { AxiosError } from 'axios';

import { getMoonPayBuyQuote } from 'src/apis/moonpay';
import { convertFiatAmountToCrypto as utorgConvertFiatAmountToCrypto } from 'src/apis/utorg';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { TopUpInterfaceBase } from 'src/interfaces/topup.interface';
import { PairLimits } from 'src/store/buy-with-credit-card/state';
import { createEntity } from 'src/store/create-entity';
import { showErrorToast } from 'src/toast/error-toast.utils';

import { getAxiosQueryErrorMessage } from './get-axios-query-error-message';
import { isDefined } from './is-defined';

const getInputAmountFunctions: Partial<
  Record<TopUpProviderEnum, (fiatSymbol: string, cryptoSymbol: string, amount: number) => Promise<number>>
> = {
  [TopUpProviderEnum.MoonPay]: async (fiatSymbol, cryptoSymbol, amount) => {
    const { baseCurrencyAmount } = await getMoonPayBuyQuote(
      cryptoSymbol.toLowerCase(),
      fiatSymbol.toLowerCase(),
      undefined,
      amount
    );

    return baseCurrencyAmount;
  },
  [TopUpProviderEnum.Utorg]: async (fiatSymbol, cryptoSymbol, amount) =>
    utorgConvertFiatAmountToCrypto(fiatSymbol, cryptoSymbol, undefined, amount)
};

export const getUpdatedFiatLimits = async (
  fiatCurrency: TopUpInterfaceBase,
  cryptoCurrency: TopUpInterfaceBase,
  providerId: TopUpProviderEnum
): Promise<PairLimits[TopUpProviderEnum]> => {
  const { minAmount: minCryptoAmount, maxAmount: maxCryptoAmount } = cryptoCurrency;

  const limitsResult = await Promise.all(
    [minCryptoAmount, maxCryptoAmount].map(async cryptoAmount => {
      const getInputAmount = getInputAmountFunctions[providerId];

      if (isDefined(getInputAmount) && isDefined(cryptoAmount)) {
        try {
          const result = await getInputAmount(fiatCurrency.code, cryptoCurrency.code, cryptoAmount);

          return createEntity(result);
        } catch (err) {
          if (err instanceof AxiosError && err.response?.status === 400) {
            return createEntity(undefined);
          }

          const message = getAxiosQueryErrorMessage(err);
          showErrorToast({ description: message });

          return createEntity(undefined, false, message);
        }
      }

      return createEntity(undefined);
    })
  );

  const [
    { data: minFiatAmountByCrypto, error: minAmountError },
    { data: maxFiatAmountByCrypto, error: maxAmountError }
  ] = limitsResult;

  return createEntity(
    {
      min: Math.max(minFiatAmountByCrypto ?? 0, fiatCurrency.minAmount ?? 0),
      max: Math.min(maxFiatAmountByCrypto ?? Infinity, fiatCurrency.maxAmount ?? Infinity)
    },
    false,
    minAmountError ?? maxAmountError
  );
};
