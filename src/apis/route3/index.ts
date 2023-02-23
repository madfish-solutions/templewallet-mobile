import axios from 'axios';

import { TEMPLE_WALLET_ROUTE3_AUTH_TOKEN } from 'src/utils/env.utils';

export const route3Api = axios.create({
  baseURL: 'https://temple.3route.io',
  headers: {
    Authorization: TEMPLE_WALLET_ROUTE3_AUTH_TOKEN
  }
});
