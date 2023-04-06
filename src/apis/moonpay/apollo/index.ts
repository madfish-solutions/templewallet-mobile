import { gql } from '@apollo/client';
import { map } from 'rxjs';

import { getApolloConfigurableClient } from 'src/apollo/utils/get-apollo-configurable-client.util';

import { MOONPAY_API_KEY } from '../consts';
import { CryptoCurrenciesResponse, FiatCurrenciesResponse } from './types';

const MOONPAY_API = 'https://api.moonpay.com/graphql';
const apolloMoonPayClient = getApolloConfigurableClient(MOONPAY_API);

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
      precision
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
