import axios from 'axios';
import { BigNumber } from 'bignumber.js';

import { getMoonPayBuyQuote } from 'src/apis/moonpay';
import { getMtPelerinConvertQuote, getMtPelerinSellLimit } from 'src/apis/mt-pelerin';
import { MT_PELERIN_NETWORK } from 'src/apis/mt-pelerin/consts';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PairLimitsRecord } from 'src/store/buy-with-credit-card/state';
import { TopUpInputInterface, TopUpOutputInterface } from 'src/store/buy-with-credit-card/types';
import { createEntity } from 'src/store/create-entity';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { isDefined } from 'src/utils/is-defined';

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
  }
};

const MT_PELERIN_MAX_BUY_CHF = 100_000;
const MT_PELERIN_FEE_PROBE_AMOUNT = 100;

const roundToFiatPrecision = (value: number, precision: number, roundingMode: BigNumber.RoundingMode) =>
  new BigNumber(value).decimalPlaces(precision, roundingMode).toNumber();

export const getMtPelerinUpdatedFiatLimits = async (
  fiatCurrency: TopUpInputInterface,
  cryptoCurrency: TopUpOutputInterface
): Promise<PairLimitsRecord[TopUpProviderEnum]> => {
  try {
    const fiatCode = fiatCurrency.code.toUpperCase();
    const fiatPrecision = fiatCurrency.precision ?? 2;
    const quotePromise = getMtPelerinConvertQuote(
      fiatCode,
      cryptoCurrency.code,
      MT_PELERIN_FEE_PROBE_AMOUNT,
      MT_PELERIN_NETWORK
    );
    const [{ fees }, max] = await Promise.all([
      quotePromise,
      fiatCode === 'CHF'
        ? Promise.resolve(MT_PELERIN_MAX_BUY_CHF)
        : Promise.all([getMtPelerinSellLimit(fiatCode), getMtPelerinSellLimit('CHF')]).then(
            ([fiatSellLimit, chfSellLimit]) => (MT_PELERIN_MAX_BUY_CHF * fiatSellLimit) / chfSellLimit
          )
    ]);
    const min = roundToFiatPrecision(
      Number(fees.networkFee) + Number(fees.fixFee) + 10 ** -fiatPrecision,
      fiatPrecision,
      BigNumber.ROUND_CEIL
    );
    const flooredMax = roundToFiatPrecision(max, fiatPrecision, BigNumber.ROUND_FLOOR);

    return createEntity({ min, max: flooredMax });
  } catch (error) {
    return createEntity(undefined, false, getAxiosQueryErrorMessage(error));
  }
};

export const getUpdatedFiatLimits = async (
  fiatCurrency: TopUpInputInterface,
  cryptoCurrency: TopUpOutputInterface,
  providerId: TopUpProviderEnum,
  trackErrorEvent?: (error: unknown) => void
): Promise<PairLimitsRecord[TopUpProviderEnum]> => {
  if (providerId === TopUpProviderEnum.MtPelerin) {
    const result = await getMtPelerinUpdatedFiatLimits(fiatCurrency, cryptoCurrency);
    if (isDefined(result.error)) {
      trackErrorEvent?.(new Error(result.error));
    }

    return result;
  }

  const { minAmount: minCryptoAmount, maxAmount: maxCryptoAmount } = cryptoCurrency;

  const limitsResult = await Promise.all(
    [minCryptoAmount, maxCryptoAmount].map(async cryptoAmount => {
      const getInputAmount = getInputAmountFunctions[providerId];

      if (isDefined(getInputAmount) && isDefined(cryptoAmount)) {
        try {
          const result = await getInputAmount(fiatCurrency.code, cryptoCurrency.code, cryptoAmount);

          return createEntity(result);
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 400) {
            const { moonPayErrorCode, metadata } = err.response.data ?? {};
            if (moonPayErrorCode === '5_TM_MIN_BUY_AMOUNT_NOT_MET' && typeof metadata?.minBuyAmountBase === 'string') {
              const parsedMinBuyAmount = Number.parseFloat(metadata.minBuyAmountBase);
              if (parsedMinBuyAmount > 0) {
                return createEntity(parsedMinBuyAmount);
              }
            }

            if (moonPayErrorCode === '5_TM_MAX_BUY_AMOUNT_EXCEEDED' && typeof metadata?.maxBuyAmountBase === 'string') {
              const parsedMaxBuyAmount = Number.parseFloat(metadata.maxBuyAmountBase);
              if (parsedMaxBuyAmount > 0) {
                return createEntity(parsedMaxBuyAmount);
              }
            }

            return createEntity(undefined);
          }

          trackErrorEvent?.(err);
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
