import { from, of, switchMap } from 'rxjs';

import { quipuStakingApi } from '../api.service';
import { isDefined } from './is-defined';

export const QUIPU_DEFAULT_PERCENTAGE = 13.5;

interface QuipuswapTokenMetadata {
  contractAddress: string;
  fa2TokenId?: string;
  isWhitelisted: boolean;
  metadata: {
    decimals: number;
    is_boolean_amount?: string;
    is_transferable?: string;
    name: string;
    should_prefer_symbol?: string;
    symbol: string;
    thumbnailUri?: string;
    token_id?: string;
  };
  type: 'FA2' | 'FA12';
}

interface QuipuswapStakingInfoResponse {
  item?: {
    apr: number;
    apy: number;
    currentDelegate: string;
    depositExchangeRate: string;
    depositTokenUrl: string;
    earnExchangeRate: string;
    endTime: string;
    harvestFee: string;
    id: string;
    nextDelegate: string;
    rewardPerSecond: string;
    rewardPerShare: string;
    rewardToken: QuipuswapTokenMetadata;
    stakeStatus: string;
    stakeUrl: string;
    staked: string;
    stakedToken: QuipuswapTokenMetadata;
    timelock: string;
    tokenA: QuipuswapTokenMetadata;
    tvlInStakedToken: string;
    tvlInUsd: string;
    udp: string;
    withdrawalFee: string;
  };
  blockInfo: {
    hash: string;
    level: number;
    timestamp: string;
  };
}

export const getQuipuStakingInfo = async (): Promise<QuipuswapStakingInfoResponse> => {
  return quipuStakingApi.get('/list/3').then(r => r.data);
};

export const loadQuipuApy$ = () =>
  from(getQuipuStakingInfo()).pipe(
    switchMap(tokenList => {
      if (isDefined(tokenList) && isDefined(tokenList.item) && isDefined(tokenList.item.apy)) {
        return of(tokenList.item.apy);
      }

      return of(QUIPU_DEFAULT_PERCENTAGE);
    })
  );
