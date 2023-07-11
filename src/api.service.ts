import axios from 'axios';
import { Platform } from 'react-native';

import { version as appVersion } from '../package.json';
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

export const templeWalletApi = axios.create({ baseURL: TEMPLE_WALLET_API_URL + '/api' });

export const tezosMetadataApi = axios.create({ baseURL: TEZOS_METADATA_API_URL });

export const whitelistApi = axios.create({
  baseURL: 'https://raw.githubusercontent.com/madfish-solutions/tokens-whitelist/master/'
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

export const optimalApi = axios.create({
  baseURL: 'https://i.useoptimal.xyz',
  headers: {
    'User-Agent': `TempleWallet-${Platform.OS}/${appVersion}`
  }
});
