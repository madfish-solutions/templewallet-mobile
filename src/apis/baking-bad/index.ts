import axios from 'axios';

import type { GetBakerResponseData, BakerInterface } from './types';

export { mockBaker } from './consts';
export type { BakerInterface } from './types';

export const bakingBadApi = axios.create({ baseURL: 'https://api.baking-bad.org/v2' });

export const fetchBaker = (address: string) =>
  bakingBadApi.get<GetBakerResponseData>(`/bakers/${address}`).then(({ data }) => (data === '' ? null : data));

export const buildUnknownBaker = (address: string, name = 'Unknown baker'): BakerInterface => ({
  address,
  name,
  isUnknownBaker: true,
  logo: '',
  balance: 0,
  stakingBalance: 0,
  stakingCapacity: 0,
  maxStakingBalance: 0,
  freeSpace: 0,
  fee: 0,
  minDelegation: 0,
  payoutDelay: 0,
  payoutPeriod: 0,
  openForDelegation: false,
  imatedRoi: 0,
  serviceType: 'tezos_only',
  serviceHealth: 'dead',
  payoutTiming: 'no_data',
  payoutAccuracy: 'no_data',
  audit: '',
  insuranceCoverage: 0
});
