import { from, map } from 'rxjs';

import { templeAdsApi, templeWalletApi } from 'src/api.service';
import { BlockInfo } from 'src/interfaces/block-info.interface';

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

export interface TezosMarket {
  id: string;
  symbol: string;
  name: string;
  image: string | null;
  current_price: number | null;
  market_cap: number | null;
  total_volume: number | null;
  circulating_supply: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
}

export const fetchTezosMarkets = () => templeWalletApi.get<TezosMarket[]>('/tezos-markets').then(({ data }) => data);
