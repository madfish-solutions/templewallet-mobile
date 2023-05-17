import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import axios from 'axios';
import { BigNumber } from 'bignumber.js';

import { isDefined } from 'src/utils/is-defined';

import {
  FarmsListResponse,
  SingleFarmResponse,
  StableswapPoolStorage,
  StableswapPoolsValue,
  StableswapPoolVersion
} from './types';

const stakingApi = axios.create({ baseURL: 'https://staking-api-mainnet.prod.quipuswap.com' });
const bcdApi = axios.create({ baseURL: 'https://api.better-call.dev/v1' });

export const getSingleV3Farm = async (id: string) => {
  const response = await stakingApi.get<SingleFarmResponse>(`/v3/multi-v2/${id}`);

  return response.data;
};

export const getV3FarmsList = async () => {
  const response = await stakingApi.get<FarmsListResponse>('/v3/multi-v2');

  return response.data.list;
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
