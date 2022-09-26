import { BigNumber } from 'bignumber.js';

import { utorgApi } from '../api.service';
import { isDefined } from './is-defined';

enum currencyInfoType {
  CRYPTO = 'CRYPTO',
  FIAT = 'FIAT'
}

interface utorgCurrencyInfo {
  currency: string;
  symbol: string;
  chain: string;
  display: string;
  caption: string;
  explorerTx: string;
  explorerAddr: string;
  type: currencyInfoType;
  enabled: boolean;
  depositMin: number;
  depositMax: number;
  withdrawalMin: number;
  withdrawalMax: number;
  addressValidator: string;
  precision: number;
  allowTag: boolean;
}

export const createOrder = (amount: number, paymentCurrency: string, address: string) =>
  utorgApi
    .post<{ data: { url: string } }>('/order/init', {
      type: 'FIAT_TO_CRYPTO',
      currency: 'XTZ',
      amount,
      paymentCurrency,
      address,
      externalId: Number(new Date()).toString() + paymentCurrency + amount.toString()
    })
    .then(r => r.data.data.url);

export const convertFiatAmountToXtz = (paymentAmount: number, fromCurrency: string) =>
  utorgApi
    .post<{ data: number }>('/tools/convert', {
      fromCurrency,
      paymentAmount,
      toCurrency: 'XTZ'
    })
    .then(r => r.data.data);

export const getExchangeRate = (fromCurrency: string, paymentAmount?: BigNumber) => {
  const finalPaymentAmount = isDefined(paymentAmount) ? (paymentAmount.eq(0) ? 1 : paymentAmount.toNumber()) : 1;

  return convertFiatAmountToXtz(finalPaymentAmount, fromCurrency).then(
    res => Math.round((res / finalPaymentAmount) * 10000) / 10000
  );
};
export const getCurrenciesInfo = () =>
  utorgApi.post<{ data: utorgCurrencyInfo[] }>('/settings/currency').then(r => r.data.data);

export const getMinMaxExchangeValue = () =>
  getCurrenciesInfo().then(currenciesInfo => {
    const tezInfo = currenciesInfo.find(currencyInfo => currencyInfo.currency === 'XTZ');
    if (isDefined(tezInfo)) {
      return { minAmount: tezInfo.withdrawalMin, maxAmount: tezInfo.withdrawalMax };
    }

    return { minAmount: 0, maxAmount: 0 };
  });

export const getAvailableFiatCurrencies = () =>
  getCurrenciesInfo().then(currenciesInfo =>
    currenciesInfo
      .filter(currencyInfo => currencyInfo.type === currencyInfoType.FIAT)
      .map(currencyInfo => currencyInfo.currency)
  );
