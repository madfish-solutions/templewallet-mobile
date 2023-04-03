import { encode } from 'querystring';

import { moonPayApi, templeWalletApi } from '../api.service';

interface QuoteResponse {
  baseCurrencyAmount: number;
  quoteCurrencyAmount: number;
  extraFeeAmount: number;
  extraFeePercentage: number;
  feeAmount: number;
  networkFeeAmount: number;
  totalAmount: number;
}

const MOONPAY_DOMAIN = 'https://buy.moonpay.com';
export const MOONPAY_ASSETS_BASIC_URL = 'https://static.moonpay.com';
export const MOONPAY_API_KEY = 'pk_live_PrSDks3YtrreqFifd0BsIji7xPXjSGx';

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
