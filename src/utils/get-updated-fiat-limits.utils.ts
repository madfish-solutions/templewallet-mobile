import axios, { AxiosError } from 'axios';

import { getMoonPayBuyQuote } from 'src/apis/moonpay';
import { getBinanceConnectBuyPair } from 'src/apis/temple-static';
import { convertFiatAmountToCrypto as utorgConvertFiatAmountToCrypto } from 'src/apis/utorg';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { TopUpInterfaceBase } from 'src/interfaces/topup.interface';
import { PairLimitsRecord } from 'src/store/buy-with-credit-card/state';
import { createEntity } from 'src/store/create-entity';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';

import { PAIR_NOT_FOUND_MESSAGE } from './constants/buy-with-credit-card';
import { getAxiosQueryErrorMessage } from './get-axios-query-error-message';

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
): Promise<PairLimitsRecord[TopUpProviderEnum]> => {
  const { minAmount: minCryptoAmount, maxAmount: maxCryptoAmount } = cryptoCurrency;

  const limitsResult =
    providerId === TopUpProviderEnum.BinanceConnect
      ? await getBinanceConnectPair(fiatCurrency.code, cryptoCurrency.code).then(
          pair => [createEntity(pair.minLimit), createEntity(pair.maxLimit)],
          error => {
            const message = error instanceof Error ? error.message : undefined;

            if (isString(message) && message !== PAIR_NOT_FOUND_MESSAGE) {
              showErrorToast({ description: message });
            }

            return [createEntity(undefined, false, message), createEntity(undefined, false, message)];
          }
        )
      : await Promise.all(
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

  const error = minAmountError ?? maxAmountError;

  return createEntity(
    isDefined(error)
      ? undefined
      : {
          min: Math.max(minFiatAmountByCrypto ?? 0, fiatCurrency.minAmount ?? 0),
          max: Math.min(maxFiatAmountByCrypto ?? Infinity, fiatCurrency.maxAmount ?? Infinity)
        },
    false,
    error
  );
};

const getBinanceConnectPair = (fiatCode: string, cryptoCode: string) =>
  getBinanceConnectBuyPair(fiatCode, cryptoCode).catch(error => {
    if (!axios.isAxiosError(error)) {
      throw new Error('Unknown error');
    }
    if (error.response && [400, 404].includes(error.response.status)) {
      throw new Error(PAIR_NOT_FOUND_MESSAGE);
    }
    throw new Error(getAxiosQueryErrorMessage(error));
  });
