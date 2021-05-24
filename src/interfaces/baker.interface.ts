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
