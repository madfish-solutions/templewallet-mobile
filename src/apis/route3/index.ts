import axios from 'axios';

import { TEMPLE_WALLET_ROUTE3_AUTH_TOKEN } from 'src/utils/env.utils';

export const ROUTE3_BASE_URL = 'https://temple.3route.io/v4';

export const route3Api = axios.create({
  baseURL: ROUTE3_BASE_URL,
  headers: {
    Authorization: TEMPLE_WALLET_ROUTE3_AUTH_TOKEN
  }
});
