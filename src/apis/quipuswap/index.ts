import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom } from 'rxjs';

import { AccountInterface } from 'src/interfaces/account.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { loadAssetBalance$ } from 'src/utils/token-balance.utils';

import {
  QuipuswapAPIToken,
  RawV3FarmStake,
  SingleFarmResponse,
  StableswapPoolStorage,
  StableswapPoolsValue,
  StableswapPoolVersion,
  V3FarmStake
} from './types';

const stakingApi = axios.create({ baseURL: 'https://staking-api-mainnet.prod.quipuswap.com' });
const bcdApi = axios.create({ baseURL: 'https://api.better-call.dev/v1' });

export const getSingleV3Farm = async (id: string) => {
  const response = await stakingApi.get<SingleFarmResponse>(`/v3/multi-v2/${id}`);

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

export const estimateLpTokenOutput = async (
  stableswapContract: ContractAbstraction<ContractProvider>,
  stableswapReferral: string,
  deadline: string,
  investedTokenIndex: number,
  amount: BigNumber,
  poolId: number,
  poolVersion: StableswapPoolVersion
) => {
  const { storage: internalPoolStorage } = await stableswapContract.storage<StableswapPoolStorage>();
  const { pools: poolsFromRpc } = internalPoolStorage;
  const poolFromRpc = await poolsFromRpc.get<StableswapPoolsValue>(new BigNumber(poolId));

  if (!isDefined(poolFromRpc)) {
    throw new Error(`Pool with id ${poolId} not found`);
  }

  const response = await bcdApi.post(`/contract/mainnet/${stableswapContract.address}/entrypoints/trace`, {
    name: 'invest',
    data:
      poolVersion === StableswapPoolVersion.V1
        ? {
            '@pair_97': {
              '@pair_99': {
                '@pair_103': {
                  '@pair_105': {
                    receiver: { schemaKey: 'None' },
                    referral: { schemaKey: 'Some', '@address_109': stableswapReferral }
                  },
                  deadline
                },
                in_amounts: [{ '@nat_101': String(investedTokenIndex), '@nat_102': amount.toFixed() }]
              },
              shares: '1'
            },
            pool_id: poolId
          }
        : {
            '@pair_115': {
              '@pair_117': {
                '@pair_121': {
                  '@pair_123': {
                    receiver: { schemaKey: 'None' },
                    referral: { schemaKey: 'Some', '@address_127': stableswapReferral }
                  },
                  deadline
                },
                in_amounts: [{ '@nat_120': amount.toFixed(), '@nat_119': String(investedTokenIndex) }]
              },
              shares: '1'
            },
            pool_id: poolId
          },
    cancelToken: { promise: {} }
  });
  const newTotalSupply = new BigNumber(
    response.data[0].storage_diff.children[0].children[6].children[0].children[7].value
  );

  return newTotalSupply.minus(poolFromRpc.total_supply);
};
