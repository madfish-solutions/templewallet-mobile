import axios from 'axios';

import { getEnv } from '../e2e/utils/env.utils';

export const betterCallDevApi = axios.create({ baseURL: 'https://api.better-call.dev/v1' });

export const bakingBadApi = axios.create({ baseURL: 'https://api.baking-bad.org/v2' });

export const tzktApi = axios.create({ baseURL: 'https://api.mainnet.tzkt.io/v1' });

export const templeWalletApi = axios.create({ baseURL: getEnv('TEMPLE_WALLET_API') });

export const tokenMetadataApi = axios.create({ baseURL: 'https://metadata.templewallet.com' });
