import { utorgApi } from '../api.service';

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

export const UTORG_FIAT_ICONS_BASE_URL = 'https://utorg.pro/img/flags2/icon-';
export const UTORG_CRYPTO_ICONS_BASE_URL = 'https://utorg.pro/img/cryptoIcons';

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

export const convertFiatAmountToCrypto = (paymentAmount: number, fromCurrency: string, toCurrency: string) =>
  utorgApi
    .post<{ data: number }>('/tools/convert', {
      fromCurrency,
      paymentAmount,
      toCurrency
    })
    .then(r => r.data.data);

export const getCurrenciesInfo = () =>
  utorgApi.post<{ data: utorgCurrencyInfo[] }>('/settings/currency').then(r => r.data.data);
