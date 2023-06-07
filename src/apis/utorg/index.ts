import axios from 'axios';

import { TEMPLE_WALLET_UTORG_SID } from 'src/utils/env.utils';

import { UTORG_API_URL } from './consts';
import { UtorgCurrencyInfo } from './types';

const utorgApi = axios.create({
  baseURL: UTORG_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-AUTH-SID': TEMPLE_WALLET_UTORG_SID,
    'X-AUTH-NONCE': Math.random().toString()
  }
});

export const createOrder = (amount: number, paymentCurrency: string, address: string, cryptoCurrency: string) =>
  utorgApi
    .post<{ data: { url: string } }>('/order/init', {
      type: 'FIAT_TO_CRYPTO',
      currency: cryptoCurrency,
      amount,
      paymentCurrency,
      address,
      externalId: Number(new Date()).toString() + paymentCurrency + amount.toString()
    })
    .then(r => r.data.data.url);

export async function convertFiatAmountToCrypto(
  fromCurrency: string,
  toCurrency: string,
  fiatAmount: number
): Promise<number>;
export async function convertFiatAmountToCrypto(
  fromCurrency: string,
  toCurrency: string,
  fiatAmount: undefined,
  cryptoAmount: number
): Promise<number>;
export async function convertFiatAmountToCrypto(
  fromCurrency: string,
  toCurrency: string,
  fiatAmount: number | undefined,
  cryptoAmount?: number
): Promise<number> {
  const response = await utorgApi.post<{ data: number }>('/tools/convert', {
    fromCurrency,
    paymentAmount: fiatAmount,
    amount: cryptoAmount,
    toCurrency
  });

  return response.data.data;
}

export const getCurrenciesInfo = () =>
  utorgApi.post<{ data: UtorgCurrencyInfo[] }>('/settings/currency').then(r => r.data.data);
