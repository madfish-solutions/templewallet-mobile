export interface BakerInterface {
  address: string;
  name: string;
  logo: string;
  balance: number;
  stakingBalance: number;
  stakingCapacity: number;
  maxStakingBalance: number;
  freeSpace: number;
  fee: number;
  minDelegation: number;
  payoutDelay: number;
  payoutPeriod: number;
  openForDelegation: boolean;
  imatedRoi: number;
  serviceType: 'tezos_only' | 'multiasset' | 'exchange' | 'tezos_dune';
  serviceHealth: 'active' | 'closed' | 'dead';
  payoutTiming: 'stable' | 'unstable' | 'suspicious' | 'no_data';
  payoutAccuracy: 'precise' | 'inaccurate' | 'suspicious' | 'no_data';
  audit: string;
  insuranceCoverage: number;
}

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
