import { MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { BigMap } from 'src/interfaces/big-map.interface';

enum FarmVersionEnum {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3'
}

export enum PoolType {
  STABLESWAP = 'STABLESWAP',
  DEX_TWO = 'DEX_TWO',
  LIQUIDITY_BAKING = 'LIQUIDITY_BAKING'
}

enum StableswapPoolVersion {
  V1 = 'v1',
  V2 = 'v2'
}

export enum FarmTokenStandardsEnum {
  Fa12 = 'FA12',
  Fa2 = 'FA2'
}

interface FarmTokenMetadata {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri?: string;
  categories?: string[];
}

export interface FarmToken {
  contractAddress: string;
  fa2TokenId?: number;
  type: FarmTokenStandardsEnum;
  isWhitelisted: boolean | null;
  metadata: FarmTokenMetadata;
}

interface FarmBase {
  id: string;
  contractAddress: string;
  apr: string | null;
  depositExchangeRate: string | null;
  depositTokenUrl: string;
  dailyDistribution: string;
  dailyDistributionDollarEquivalent: string;
  earnExchangeRate: string | null;
  vestingPeriodSeconds: string;
  stakeUrl: string;
  stakedToken: FarmToken;
  tokens: FarmToken[];
  rewardToken: FarmToken;
  staked: string;
  tvlInUsd: string | null;
  tvlInStakedToken: string;
  type?: PoolType;
}

interface QuipuswapFarmBase extends FarmBase {
  lastRewards: string;
  discFactor: string;
  version: FarmVersionEnum;
}

interface LiquidityBakingFarm extends FarmBase {
  type: PoolType.LIQUIDITY_BAKING;
}

interface StableswapFarm extends QuipuswapFarmBase {
  type: PoolType.STABLESWAP;
  stableswapPoolId: number;
  stableswapPoolVersion: StableswapPoolVersion;
}

interface DexTwoFarm extends QuipuswapFarmBase {
  type?: PoolType.DEX_TWO;
}

export type QuipuswapFarm = StableswapFarm | DexTwoFarm;

export type Farm = LiquidityBakingFarm | QuipuswapFarm;

interface BlockInfo {
  level: number;
  hash: string;
  timestamp: string;
}

interface SingleQuipuswapFarmResponse {
  item: QuipuswapFarm;
  blockInfo: BlockInfo;
}

export interface LiquidityBakingFarmResponse {
  item: LiquidityBakingFarm;
  blockInfo: BlockInfo;
}

export type SingleFarmResponse = SingleQuipuswapFarmResponse | LiquidityBakingFarmResponse;

export interface FarmsListResponse {
  list: SingleQuipuswapFarmResponse[];
}

export interface StableswapTokenInfo {
  rateF: BigNumber;
  precisionMultiplierF: BigNumber;
  reserves: BigNumber;
}

export interface StableswapFeesStorage {
  lpF: BigNumber;
  stakersF: BigNumber;
  refF: BigNumber;
}

interface StableswapStakerAccum {
  accumulatorF: BigNumber[];
  totalFees: BigNumber[];
  totalStaked: BigNumber;
}

export interface StableswapPool {
  initialAF: BigNumber;
  /** timestamp in seconds */
  initialATime: BigNumber;
  futureAF: BigNumber;
  /** timestamp in seconds */
  futureATime: BigNumber;
  tokensInfo: StableswapTokenInfo[];
  fee: StableswapFeesStorage;
  stakerAccumulator: StableswapStakerAccum;
  totalSupply: BigNumber;
}

export interface BalancingAccum {
  stakerAccumulator: StableswapStakerAccum;
  tokensInfo: StableswapTokenInfo[];
  tokensInfoWithoutLp: StableswapTokenInfo[];
}

export interface PrepareParamsAccum {
  s_: BigNumber;
  c: [BigNumber, BigNumber];
}

export class TooLowPoolReservesError extends Error {
  constructor(
    message = 'Pool reserves are too low. Please try again later, try another token or try unstaking and divesting liquidity in balanced proportion from Quipuswap dApp.'
  ) {
    super(message);
  }
}

interface RawStableswapTokensInfoValue {
  rate_f: BigNumber;
  precision_multiplier_f: BigNumber;
  reserves: BigNumber;
}

interface RawStableswapFee {
  lp_f: BigNumber;
  stakers_f: BigNumber;
  ref_f: BigNumber;
}

interface RawStableswapStakerAccumulator {
  accumulator_f: MichelsonMap<BigNumber, BigNumber>;
  total_fees: MichelsonMap<BigNumber, BigNumber>;
  total_staked: BigNumber;
}

interface StableswapPoolsValue {
  initial_A_f: BigNumber;
  initial_A_time: string;
  future_A_f: BigNumber;
  future_A_time: string;
  total_supply: BigNumber;
  tokens_info: MichelsonMap<BigNumber, RawStableswapTokensInfoValue>;
  fee: RawStableswapFee;
  staker_accumulator: RawStableswapStakerAccumulator;
}

export interface StableswapPoolStorage {
  storage: {
    pools: BigMap<BigNumber, StableswapPoolsValue>;
    factory_address: string;
  };
}
