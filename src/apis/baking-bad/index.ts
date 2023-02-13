import axios from 'axios';

import { emptyBaker } from './consts';
import type { GetBakerResponseData, BakerInterface } from './types';

export { emptyBaker, mockBaker } from './consts';
export type { BakerInterface } from './types';

export const bakingBadApi = axios.create({ baseURL: 'https://api.baking-bad.org/v2' });

export const fetchBaker = (address: string) =>
  bakingBadApi.get<GetBakerResponseData>(`/bakers/${address}`).then(({ data }) => (data === '' ? null : data));

export const buildUnknownBaker = (address: string): BakerInterface => ({
  ...emptyBaker,
  address,
  name: 'Unknown baker'
});
