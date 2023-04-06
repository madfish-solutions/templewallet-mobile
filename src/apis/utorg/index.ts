import axios from 'axios';

import { TEMPLE_WALLET_UTORG_SID } from 'src/utils/env.utils';

import { UtorgCurrencyInfo } from './types';

const utorgApi = axios.create({
  baseURL: 'https://app.utorg.pro/api/merchant/v1',
  headers: {
    'Content-Type': 'application/json',
    'X-AUTH-SID': TEMPLE_WALLET_UTORG_SID,
    'X-AUTH-NONCE': Math.random().toString()
  }
});

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
  utorgApi.post<{ data: UtorgCurrencyInfo[] }>('/settings/currency').then(r => r.data.data);
