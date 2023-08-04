import type { BakerInterface } from './types';

export const emptyBaker: BakerInterface = {
  address: '',
  name: '',
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
};

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

export const EVERSTAKE_PAYOUTS_BAKER = {
  address: 'tz1W1en9UpMCH4ZJL8wQCh8JDKCZARyVx2co',
  logo: 'https://services.tzkt.io/v1/avatars/tz1aRoaRhSpRYvFdyvgWLL6TGyRoGF51wDjM',
  name: 'Everstake'
};
