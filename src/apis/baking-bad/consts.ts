import type { BakerInterface } from './types';

export const mockBaker: BakerInterface = {
  address: 'mockBackerAddress',
  name: 'Mock Backer',
  logo: 'https://mock-backer.logo',
  balance: 444444,
  stakingBalance: 444444,
  stakingCapacity: 444,
  maxStakingBalance: 444,
  freeSpace: 44,
  fee: 4,
  minDelegation: 444,
  payoutDelay: 44,
  payoutPeriod: 44,
  openForDelegation: true,
  imatedRoi: 4,
  serviceType: 'tezos_only',
  serviceHealth: 'active',
  payoutTiming: 'stable',
  payoutAccuracy: 'precise',
  audit: 'Mock Audit',
  insuranceCoverage: 44
};
