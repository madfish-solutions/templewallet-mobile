import axios from 'axios';

import { TEMPLE_WALLET_API } from './utils/env.utils';
import { isDcpNode } from './utils/network.utils';

export const bakingBadApi = axios.create({ baseURL: 'https://api.baking-bad.org/v2' });

const tzktApi = axios.create({ baseURL: 'https://api.mainnet.tzkt.io/v1' });
const dcpTzktApi = axios.create({ baseURL: 'https://explorer.tlnt.net:8001/v1' });

export const getTzktApi = (selectedRpcUrl: string) => (isDcpNode(selectedRpcUrl) ? dcpTzktApi : tzktApi);

export const templeWalletApi = axios.create({ baseURL: TEMPLE_WALLET_API });

export const tokenMetadataApi = axios.create({ baseURL: 'https://metadata.templewallet.com' });

export const coingeckoApi = axios.create({ baseURL: 'https://api.coingecko.com/api/v3/' });
