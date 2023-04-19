import axios from 'axios';
import { encode } from 'querystring';

import { templeWalletApi } from 'src/api.service';

import { MOONPAY_API_KEY, MOONPAY_API_URL, MOONPAY_DOMAIN } from './consts';
import { QuoteResponse } from './types';

const moonPayApi = axios.create({ baseURL: MOONPAY_API_URL });

export const getSignedMoonPayUrl = async (
  currencyCode?: string,
  colorCode?: string,
  walletAddress?: string,
  baseCurrencyAmount?: string | number,
  baseCurrencyCode?: string
) => {
  const queryParams = encode({
    apiKey: MOONPAY_API_KEY,
    currencyCode,
    colorCode,
    walletAddress,
    baseCurrencyAmount,
    baseCurrencyCode
  });
  const url = `${MOONPAY_DOMAIN}?${queryParams}`;
  const result = await templeWalletApi.get<{ signedUrl: string }>('/moonpay-sign', { params: { url } });

  return result.data.signedUrl;
};

export async function getMoonPayBuyQuote(
  cryptoSymbol: string,
  baseCurrencyCode: string,
  baseCurrencyAmount: string | number
) {
  const result = await moonPayApi.get<QuoteResponse>(`/v3/currencies/${cryptoSymbol}/buy_quote`, {
    params: {
      apiKey: MOONPAY_API_KEY,
      baseCurrencyAmount,
      baseCurrencyCode,
      fixed: true,
      areFeesIncluded: true,
      regionalPricing: true
    }
  });

  return result.data;
}
