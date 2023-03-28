import { gql } from '@apollo/client';
import { map } from 'rxjs';

import { MOONPAY_API_KEY } from 'src/utils/moonpay.utils';

import { getApolloConfigurableClient } from './utils/get-apollo-configurable-client.util';

const MOONPAY_API = 'https://api.moonpay.com/graphql';
const apolloMoonPayClient = getApolloConfigurableClient(MOONPAY_API);

interface CryptoCurrenciesResponse {
  cryptoCurrencies: Array<{
    id: string;
    name: string;
    code: string;
    icon: string;
    minBuyAmount: number | null;
    maxBuyAmount: number | null;
    networkCode: string;
    supportsLiveMode: boolean;
    isSuspended: boolean;
  }>;
}

interface FiatCurrenciesResponse {
  fiatCurrencies: Array<{
    id: string;
    name: string;
    code: string;
    icon: string;
    precision: number;
    maxBuyAmount: number;
    minBuyAmount: number;
    lowLimitAmount: number;
  }>;
}

const CRYPTO_CURRENCIES_QUERY = gql`
  query cryptoCurrencies($apiKey: String!) {
    cryptoCurrencies(apiKey: $apiKey) {
      id
      name
      code
      icon
      minBuyAmount
      maxBuyAmount
      networkCode
      supportsLiveMode
      isSuspended
      __typename
    }
  }
`;

const FIAT_CURRENCIES_QUERY = gql`
  query fiatCurrencies($apiKey: String!) {
    fiatCurrencies(apiKey: $apiKey) {
      id
      name
      code
      icon
      precision
      maxBuyAmount
      minBuyAmount
      lowLimitAmount
      __typename
    }
  }
`;

export const fetchMoonpayCryptoCurrencies$ = () =>
  apolloMoonPayClient
    .query<CryptoCurrenciesResponse>(CRYPTO_CURRENCIES_QUERY, { apiKey: MOONPAY_API_KEY })
    .pipe(map(data => data.cryptoCurrencies));

export const fetchMoonpayFiatCurrencies$ = () =>
  apolloMoonPayClient
    .query<FiatCurrenciesResponse>(FIAT_CURRENCIES_QUERY, { apiKey: MOONPAY_API_KEY })
    .pipe(map(data => data.fiatCurrencies));
