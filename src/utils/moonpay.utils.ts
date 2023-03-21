import { encode } from 'querystring';

import { moonPayApi, templeWalletApi } from '../api.service';

const MOONPAY_DOMAIN = 'https://buy.moonpay.com';
export const MOONPAY_API_KEY = 'pk_live_PrSDks3YtrreqFifd0BsIji7xPXjSGx';

export const getSignedMoonPayUrl = async (currencyCode: string, colorCode: string, walletAddress: string) => {
  const queryParams = encode({
    apiKey: MOONPAY_API_KEY,
    currencyCode,
    colorCode,
    walletAddress
  });
  const url = `${MOONPAY_DOMAIN}?${queryParams}`;
  const result = await templeWalletApi.get<{ signedUrl: string }>('/moonpay-sign', { params: { url } });

  return result.data.signedUrl;
};

export const getMoonPayBuyQuote = async (
  cryptoSymbol: string,
  baseCurrencyAmount: string | number,
  baseCurrencyCode: string
) => {
  const result = await moonPayApi.get<{ quoteCurrencyAmount: number }>(`/v3/currencies/${cryptoSymbol}/buy_quote`, {
    params: {
      apiKey: MOONPAY_API_KEY,
      baseCurrencyAmount,
      baseCurrencyCode,
      fixed: true,
      areFeesIncluded: true
    }
  });

  return result.data.quoteCurrencyAmount;
};
