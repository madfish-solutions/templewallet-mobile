import axios from 'axios';

import { TEMPLE_WALLET_API, TEMPLE_WALLET_EVERSTAKE_API_KEY, TEMPLE_WALLET_EXOLIX_API_KEY } from './utils/env.utils';

export const bakingBadApi = axios.create({ baseURL: 'https://api.baking-bad.org/v2' });

export const tzktApi = axios.create({ baseURL: 'https://api.mainnet.tzkt.io/v1' });

export const templeWalletApi = axios.create({ baseURL: TEMPLE_WALLET_API });

export const tokenMetadataApi = axios.create({ baseURL: 'https://metadata.templewallet.com' });

export const coingeckoApi = axios.create({ baseURL: 'https://api.coingecko.com/api/v3/' });

export const exolixApi = axios.create({
  baseURL: 'https://exolix.com/api/v2',
  headers: {
    Authorization: TEMPLE_WALLET_EXOLIX_API_KEY
  }
});

export const everstakeApi = axios.create({
  baseURL: 'https://aff-api.everstake.one/temple',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': TEMPLE_WALLET_EVERSTAKE_API_KEY
  }
});
