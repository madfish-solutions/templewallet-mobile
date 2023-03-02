export type GetBakerResponseData = BakerInterface | '';

export interface BakerInterface {
  address: string;
  name: string;
  logo: string;
  balance: number;
  stakingBalance?: number;
  stakingCapacity: number;
  maxStakingBalance: number;
  freeSpace?: number;
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
  config?: BakerConfig;
}

interface BakerValueHistoryItem<T> {
  cycle: number;
  value: T;
}

interface BakerConfig {
  address: string;
  fee: BakerValueHistoryItem<number>[];
  minDelegation: BakerValueHistoryItem<number>[];
  allocationFee: BakerValueHistoryItem<boolean>[];
  payoutFee: BakerValueHistoryItem<boolean>[];
  payoutDelay: BakerValueHistoryItem<number>[];
  payoutPeriod: BakerValueHistoryItem<number>[];
  minPayout: BakerValueHistoryItem<number>[];
  rewardStruct: BakerValueHistoryItem<number>[];
  payoutRatio: BakerValueHistoryItem<number>[];
  maxStakingThreshold: BakerValueHistoryItem<number>[];
  openForDelegation: BakerValueHistoryItem<boolean>[];
  ignored: string[];
  sources: string[];
}
