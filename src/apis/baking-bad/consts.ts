import type { BakerInterface } from './types';

export const mockBaker: BakerInterface = {
  address: 'mockBackerAddress',
  name: 'Mock Backer',
  balance: 444444,
  delegation: {
    minBalance: 0,
    enabled: true,
    fee: 4,
    capacity: 444,
    freeSpace: 44,
    estimatedApy: 0.01,
    features: []
  },
  staking: {
    minBalance: 0,
    enabled: true,
    fee: 4,
    capacity: 444,
    freeSpace: 44,
    estimatedApy: 0.01,
    features: []
  },
  features: [],
  status: 'active'
};
