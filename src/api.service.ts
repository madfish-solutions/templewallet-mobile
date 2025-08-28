import axios from 'axios';
import { Platform } from 'react-native';

import { concatUrlPath } from 'src/utils/url.utils';

import {
  TEMPLE_WALLET_API_URL,
  TEMPLE_WALLET_EVERSTAKE_API_KEY,
  TEMPLE_WALLET_EXOLIX_API_KEY,
  TEZOS_METADATA_API_URL
} from './utils/env.utils';
import { isDcpNode } from './utils/network.utils';

export const tzktApi = axios.create({ baseURL: 'https://api.mainnet.tzkt.io/v1' });
const dcpTzktApi = axios.create({ baseURL: 'https://explorer-api.tlnt.net/v1' });

export const getTzktApi = (selectedRpcUrl: string) => (isDcpNode(selectedRpcUrl) ? dcpTzktApi : tzktApi);

export const templeWalletApi = axios.create({
  baseURL: concatUrlPath(TEMPLE_WALLET_API_URL, '/api'),
  params: {
    platform: Platform.OS
  }
});

export const tezosMetadataApi = axios.create({ baseURL: TEZOS_METADATA_API_URL });

export const whitelistApi = axios.create({
  baseURL: 'https://raw.githubusercontent.com/madfish-solutions/tokens-whitelist/master/'
});

export const scamlistApi = axios.create({
  baseURL: 'https://raw.githubusercontent.com/madfish-solutions/tokens-scamlist/master/'
});

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
