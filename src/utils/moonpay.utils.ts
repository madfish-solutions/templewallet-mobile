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

export interface LocationResponse {
  alpha2: string;
  alpha3: string;
  country: string;
  ipAddress: string;
  isAllowed: boolean;
  isBuyAllowed: boolean;
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

export const getLocation = async () => {
  const result = await moonPayApi.get<LocationResponse>('/v3/ip_address', {
    params: {
      apiKey: MOONPAY_API_KEY
    }
  });

  return result.data;
};

export async function getMoonPayBuyQuote(
  cryptoSymbol: string,
  baseCurrencyCode: string,
  baseCurrencyAmount: string | number
): Promise<QuoteResponse>;
export async function getMoonPayBuyQuote(
  cryptoSymbol: string,
  baseCurrencyCode: string,
  baseCurrencyAmount: undefined,
  quoteCurrencyAmount: string | number
): Promise<QuoteResponse>;
export async function getMoonPayBuyQuote(
  cryptoSymbol: string,
  baseCurrencyCode: string,
  baseCurrencyAmount?: string | number,
  quoteCurrencyAmount?: string | number
) {
  const result = await moonPayApi.get<QuoteResponse>(`/v3/currencies/${cryptoSymbol}/buy_quote`, {
    params: {
      apiKey: MOONPAY_API_KEY,
      baseCurrencyAmount,
      baseCurrencyCode,
      quoteCurrencyAmount,
      fixed: true,
      areFeesIncluded: true,
      regionalPricing: true
    }
  });
  console.log('x1', result.data);

  return result.data;
}
