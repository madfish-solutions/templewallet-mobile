import axios from 'axios';

import { TEMPLE_WALLET_API } from './utils/env.utils';

export const betterCallDevApi = axios.create({ baseURL: 'https://api.better-call.dev/v1' });

export const bakingBadApi = axios.create({ baseURL: 'https://api.baking-bad.org/v2' });

export const tzktApi = axios.create({ baseURL: 'https://api.mainnet.tzkt.io/v1' });

export const templeWalletApi = axios.create({ baseURL: TEMPLE_WALLET_API });

export const tokenMetadataApi = axios.create({ baseURL: 'https://metadata.templewallet.com' });

export const coingeckoApi = axios.create({ baseURL: 'https://api.coingecko.com/api/v3/' });
