import { BigMapAbstraction, MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

export enum FarmVersionEnum {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3'
}

export enum PoolType {
  STABLESWAP = 'STABLESWAP',
  DEX_TWO = 'DEX_TWO'
}

export enum StableswapPoolVersion {
  V1 = 'v1',
  V2 = 'v2'
}

export enum QuipuswapAPITokenStandardsEnum {
  Fa12 = 'FA12',
  Fa2 = 'FA2'
}
interface QuipuswapAPITokenMetadata {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri: string;
  categories?: string[];
}

export interface QuipuswapAPIToken {
  contractAddress: string;
  fa2TokenId?: number;
  type: QuipuswapAPITokenStandardsEnum;
  isWhitelisted: boolean | null;
  metadata: QuipuswapAPITokenMetadata;
}

interface FarmBase {
  id: string;
  contractAddress: string;
  apr: string | null;
  depositExchangeRate: string | null;
  depositTokenUrl: string;
  lastRewards: string;
  discFactor: string;
  dailyDistribution: string;
  dailyDistributionDollarEquivalent: string;
  earnExchangeRate: string | null;
  vestingPeriodSeconds: string;
  stakeUrl: string;
  stakedToken: QuipuswapAPIToken;
  tokens: QuipuswapAPIToken[];
  rewardToken: QuipuswapAPIToken;
  staked: string;
  tvlInUsd: string | null;
  tvlInStakedToken: string;
  version: FarmVersionEnum;
  type?: PoolType;
}

interface StableswapFarm extends FarmBase {
  type: PoolType.STABLESWAP;
  stableswapPoolId: number;
  stableswapPoolVersion: StableswapPoolVersion;
}

interface OtherFarm extends FarmBase {
  type?: PoolType.DEX_TWO;
}

export type Farm = StableswapFarm | OtherFarm;

interface BlockInfo {
  level: number;
  hash: string;
  timestamp: string;
}

export interface SingleFarmResponse {
  item: Farm;
  blockInfo: BlockInfo;
}

export interface FarmsListResponse {
  list: SingleFarmResponse[];
}

interface StableswapTokensInfoValue {
  rate_f: BigNumber;
  precision_multiplier_f: BigNumber;
  reserves: BigNumber;
}

interface StableswapFee {
  lp_f: BigNumber;
  stakers_f: BigNumber;
  ref_f: BigNumber;
}

interface StableswapStakerAccumulator {
  accumulator_f: MichelsonMap<BigNumber, BigNumber>;
  total_fees: MichelsonMap<BigNumber, BigNumber>;
  total_staked: BigNumber;
}

export interface StableswapPoolsValue {
  initial_A_f: BigNumber;
  initial_A_time: string;
  future_A_f: BigNumber;
  future_A_time: string;
  total_supply: BigNumber;
  tokens_info: MichelsonMap<BigNumber, StableswapTokensInfoValue>;
  fee: StableswapFee;
  staker_accumulator: StableswapStakerAccumulator;
}

export interface StableswapPoolStorage {
  storage: {
    tokens: BigMapAbstraction;
    pools: BigMapAbstraction;
    factory_address: string;
  };
}
