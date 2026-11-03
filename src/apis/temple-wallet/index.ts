import { BigNumber } from 'bignumber.js';
import { from, map } from 'rxjs';

import { templeAdsApi, templeWalletApi } from 'src/api.service';
import { BlockInfo } from 'src/interfaces/block-info.interface';
import { isDefined } from 'src/utils/is-defined';

import { LiquidityBakingFarm } from '../liquidity-baking/types';

export enum ABTestGroup {
  A = 'A',
  B = 'B',
  Unknown = 'Unknown'
}

interface GetABGroupResponse {
  ab: ABTestGroup.A | ABTestGroup.B;
}

export const getABGroup$ = () =>
  from(templeWalletApi.get<GetABGroupResponse>('/abtest')).pipe(map(response => response.data.ab));

export const fetchEnableInternalHypelabAds = () =>
  templeAdsApi.get<boolean>('/ads-rules/2.0.25/enable-internal-hypelab-ads').then(response => response.data);

export const fetchInternalBlacklistedHypelabCampaignsSlugs = () =>
  templeAdsApi.get<string[]>('/ads-rules/2.0.25/hypelab-campaigns-blacklist-internal').then(response => response.data);

interface LiquidityBakingStatsResponse {
  stats: Pick<
    LiquidityBakingFarm,
    | 'contractAddress'
    | 'apr'
    | 'depositExchangeRate'
    | 'dailyDistribution'
    | 'dailyDistributionDollarEquivalent'
    | 'earnExchangeRate'
    | 'vestingPeriodSeconds'
    | 'staked'
    | 'tvlInUsd'
    | 'tvlInStakedToken'
  >;
  blockInfo: BlockInfo;
}

export const getLiquidityBakingStats = () =>
  templeWalletApi.get<LiquidityBakingStatsResponse>('/liquidity-baking/stats').then(response => response.data);

export interface FastWithdrawalProvider {
  minAmountMutez: BigNumber;
  maxAmountMutez: BigNumber;
  rate: BigNumber;
}

interface RawFastWithdrawalProvider {
  min_amount_mutez: number | string;
  max_amount_mutez: number | string;
  rate: number | string;
}

const MAX_FAST_WITHDRAWAL_RATE = 0.05;

const isNumeric = (value: unknown): value is number | string => typeof value === 'number' || typeof value === 'string';

const isRawFastWithdrawalProvider = (value: unknown): value is RawFastWithdrawalProvider =>
  typeof value === 'object' &&
  value !== null &&
  'min_amount_mutez' in value &&
  isNumeric(value.min_amount_mutez) &&
  'max_amount_mutez' in value &&
  isNumeric(value.max_amount_mutez) &&
  'rate' in value &&
  isNumeric(value.rate);

const toFastWithdrawalProvider = (raw: RawFastWithdrawalProvider): FastWithdrawalProvider | undefined => {
  const minAmountMutez = new BigNumber(raw.min_amount_mutez);
  const maxAmountMutez = new BigNumber(raw.max_amount_mutez);
  const rate = new BigNumber(raw.rate);

  const isValid =
    minAmountMutez.isInteger() &&
    maxAmountMutez.isInteger() &&
    minAmountMutez.isGreaterThan(0) &&
    minAmountMutez.isLessThanOrEqualTo(maxAmountMutez) &&
    rate.isGreaterThanOrEqualTo(0) &&
    rate.isLessThanOrEqualTo(MAX_FAST_WITHDRAWAL_RATE);

  return isValid ? { minAmountMutez, maxAmountMutez, rate } : undefined;
};

export const fetchFastWithdrawalProviders = async (): Promise<FastWithdrawalProvider[]> => {
  const { data } = await templeWalletApi.get<unknown>('/etherlink-bridge/fast-withdrawal-providers', {
    timeout: 10_000
  });
  const items: unknown[] =
    typeof data === 'object' && data !== null && 'data' in data && Array.isArray(data.data) ? data.data : [];

  return items.filter(isRawFastWithdrawalProvider).map(toFastWithdrawalProvider).filter(isDefined);
};
