import axios from 'axios';

import type { GetBakerResponseData, BakerInterface } from './types';

export { mockBaker } from './consts';
export type { BakerInterface } from './types';

export const bakingBadApi = axios.create({ baseURL: 'https://api.baking-bad.org/v3' });

export const fetchBaker = (address: string) =>
  bakingBadApi.get<GetBakerResponseData>(`/bakers/${address}`).then(({ data }) => data);

export const getBakerLogoUrl = (address: string) => `https://services.tzkt.io/v1/avatars/${address}`;

export const buildUnknownBaker = (address: string, name = 'Unknown baker'): BakerInterface => ({
  address,
  name,
  isUnknownBaker: true,
  balance: 0,
  features: [],
  delegation: {
    enabled: false,
    minBalance: 0,
    fee: 0,
    capacity: 0,
    freeSpace: 0,
    estimatedApy: 0,
    features: []
  },
  staking: {
    enabled: false,
    minBalance: 0,
    fee: 0,
    capacity: 0,
    freeSpace: 0,
    estimatedApy: 0,
    features: []
  },
  status: 'closed'
});
