import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom } from 'rxjs';

import { AccountInterface } from 'src/interfaces/account.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { loadAssetBalance$ } from 'src/utils/token-balance.utils';

import {
  QuipuswapAPIToken,
  RawV3FarmStake,
  SingleFarmResponse,
  StableswapPoolResponse,
  StableswapPoolVersion,
  V3FarmStake
} from './types';

const stakingApi = axios.create({ baseURL: 'https://staking-api-mainnet.prod.quipuswap.com' });
const stableswapApi = axios.create({ baseURL: 'https://stableswap-api-mainnet.prod.quipuswap.com' });

export const getSingleV3Farm = async (id: string) => {
  const response = await stakingApi.get<SingleFarmResponse>(`/v3/multi-v2/${id}`);

  return response.data;
};

export const getStableswapPool = async (id: string | number, version: StableswapPoolVersion) => {
  const response = await stableswapApi.get<StableswapPoolResponse>(
    version === StableswapPoolVersion.V1 ? `/list/${id}` : `/list/v2/${id}`
  );

  return response.data;
};

export const getV3FarmStake = async (
  rpcUrl: string,
  contractAddress: string,
  account: AccountInterface,
  rewardToken: QuipuswapAPIToken
): Promise<V3FarmStake> => {
  const { contractAddress: rewardTokenAddress, fa2TokenId: rewardTokenId } = rewardToken;
  const { publicKeyHash: accountPkh } = account;
  const contractRewardBalance = await firstValueFrom(
    loadAssetBalance$(rpcUrl, contractAddress, getTokenSlug({ address: rewardTokenAddress, id: rewardTokenId }))
  );
  const tezos = createReadOnlyTezosToolkit(rpcUrl, account);
  const contract = await tezos.contract.at(contractAddress);
  const stakeIds: BigNumber[] = await contract.contractViews
    .view_owner_stakes(accountPkh)
    .executeView({ viewCaller: accountPkh });

  if (stakeIds.length === 0) {
    return {
      contractRewardBalance: contractRewardBalance ?? '0',
      stake: '0',
      discFactor: '0',
      ageTimestamp: new Date().toISOString()
    };
  }

  const lastStakeId = stakeIds[stakeIds.length - 1];
  const { stake, disc_factor, age_timestamp }: RawV3FarmStake = await contract.contractViews
    .view_stake(lastStakeId)
    .executeView({ viewCaller: accountPkh });

  return {
    contractRewardBalance: contractRewardBalance ?? '0',
    stakeId: lastStakeId.toFixed(),
    stake: stake.toFixed(),
    discFactor: disc_factor.toFixed(),
    ageTimestamp: age_timestamp
  };
};
