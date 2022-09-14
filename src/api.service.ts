import axios from 'axios';

import {
  TEMPLE_WALLET_API,
  TEMPLE_WALLET_EVERSTAKE_API_KEY,
  TEMPLE_WALLET_EXOLIX_API_KEY,
  TEMPLE_WALLET_UTORG_SID
} from './utils/env.utils';
import { isDcpNode } from './utils/network.utils';

export const bakingBadApi = axios.create({ baseURL: 'https://api.baking-bad.org/v2' });

const tzktApi = axios.create({ baseURL: 'https://api.mainnet.tzkt.io/v1' });
const dcpTzktApi = axios.create({ baseURL: 'https://explorer.tlnt.net:8001/v1' });

export const getTzktApi = (selectedRpcUrl: string) => (isDcpNode(selectedRpcUrl) ? dcpTzktApi : tzktApi);

export const templeWalletApi = axios.create({ baseURL: TEMPLE_WALLET_API });

export const tokenMetadataApi = axios.create({ baseURL: 'https://metadata.templewallet.com' });

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

export const utorgApi = axios.create({
  baseURL: 'https://app.utorg.pro/api/merchant/v1',
  headers: {
    'Content-Type': 'application/json',
    'X-AUTH-SID': TEMPLE_WALLET_UTORG_SID,
    'X-AUTH-NONCE': Math.random().toString()
  }
});

export const everstakeApi = axios.create({
  baseURL: 'https://aff-api.everstake.one/temple',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': TEMPLE_WALLET_EVERSTAKE_API_KEY
  }
});
