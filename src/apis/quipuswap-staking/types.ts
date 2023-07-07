import { MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { BigMap } from 'src/interfaces/big-map.interface';
import { FarmBase } from 'src/interfaces/earn-opportunity/farm-base.interface';

enum FarmVersionEnum {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3'
}

enum StableswapPoolVersion {
  V1 = 'v1',
  V2 = 'v2'
}

interface QuipuswapFarmBase extends FarmBase {
  lastRewards: string;
  discFactor: string;
  version: FarmVersionEnum;
}

export interface StableswapFarm extends QuipuswapFarmBase {
  type: EarnOpportunityTypeEnum.STABLESWAP;
  stableswapPoolId: number;
  stableswapPoolVersion: StableswapPoolVersion;
}

interface OtherFarm extends QuipuswapFarmBase {
  type?: EarnOpportunityTypeEnum.DEX_TWO;
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
