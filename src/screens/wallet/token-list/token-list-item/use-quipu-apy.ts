import { useCallback, useEffect, useState } from 'react';

import { quipuStakingApi } from '../../../../api.service';
import { isDefined } from '../../../../utils/is-defined';

const QUIPU_DEFAULT_PERCENTAGE = 13.5;

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

async function getQuipuStakingInfo(): Promise<QuipuswapStakingInfoResponse> {
  return quipuStakingApi.get('/list/3').then(r => r.data);
}

type memType = { value: number; timestamp: string };

const MEM_TIMEOUT = 1000 * 60 * 5;

const quipuApyMem: memType = { value: QUIPU_DEFAULT_PERCENTAGE, timestamp: '0' };

const isMemoized = () => Date.now() - Number(quipuApyMem.timestamp) < MEM_TIMEOUT;

export const useQuipuApy = () => {
  const [quipuApy, setQuipuApy] = useState(quipuApyMem.value);

  const getQuipuStaking = useCallback(async () => {
    return await getQuipuStakingInfo();
  }, []);

  useEffect(() => {
    (async () => {
      if (isMemoized()) {
        return;
      }
      try {
        const result = await getQuipuStaking();
        let apy = QUIPU_DEFAULT_PERCENTAGE;
        if (isDefined(result) && isDefined(result.item) && isDefined(result.item.apy)) {
          apy = result.item.apy;
        }
        quipuApyMem.value = apy;
        quipuApyMem.timestamp = Date.now().toString();
        setQuipuApy(apy);
      } catch {}
    })();
  }, []);

  return { apy: quipuApy, formattedApy: quipuApy.toFixed(2).replace(/[.,]00$/, '') };
};
