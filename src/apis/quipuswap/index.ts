import { ContractAbstraction, ContractProvider, MichelsonMap, TezosToolkit } from '@taquito/taquito';
import axios from 'axios';
import { BigNumber } from 'bignumber.js';

import { toIntegerSeconds } from 'src/utils/date.utils';
import { READ_ONLY_SIGNER_PUBLIC_KEY_HASH } from 'src/utils/env.utils';
import { isDefined } from 'src/utils/is-defined';

import { calculateStableswapLpTokenOutput } from './calculate-stableswap-lp-token-output';
import { FarmsListResponse, SingleFarmResponse, StableswapPoolStorage, StableswapPoolsValue } from './types';

const stakingApi = axios.create({ baseURL: 'https://staking-api-mainnet.prod.quipuswap.com' });

export const getV3FarmsList = async () => {
  const response = await stakingApi.get<FarmsListResponse>('/v3/multi-v2');

  return response.data.list;
};

const toArray = <T>(map: MichelsonMap<BigNumber, T>) =>
  Array.from(map.entries())
    .map(([key, value]): [number, T] => [key.toNumber(), value])
    .sort(([a], [b]) => a - b)
    .map(([, value]) => value);

export const estimateStableswapLpTokenOutput = async (
  tezos: TezosToolkit,
  stableswapContract: ContractAbstraction<ContractProvider>,
  investedTokenIndex: number,
  amount: BigNumber,
  poolId: number
) => {
  const { storage: internalPoolStorage } = await stableswapContract.storage<StableswapPoolStorage>();
  const { pools: poolsFromRpc, factory_address } = internalPoolStorage;
  const poolFromRpc = await poolsFromRpc.get<StableswapPoolsValue>(new BigNumber(poolId));
  const factoryContract = await tezos.contract.at(factory_address);
  const devFeeF = await factoryContract.contractViews
    .dev_fee()
    .executeView({ viewCaller: READ_ONLY_SIGNER_PUBLIC_KEY_HASH });

  if (!isDefined(poolFromRpc)) {
    throw new Error(`Pool with id ${poolId} not found`);
  }

  return calculateStableswapLpTokenOutput(
    Array(poolFromRpc.tokens_info.size)
      .fill(new BigNumber(0))
      .map((_, index) => (index === investedTokenIndex ? amount : new BigNumber(0))),
    {
      initialAF: poolFromRpc.initial_A_f,
      initialATime: new BigNumber(toIntegerSeconds(new Date(poolFromRpc.initial_A_time))),
      futureAF: poolFromRpc.future_A_f,
      futureATime: new BigNumber(toIntegerSeconds(new Date(poolFromRpc.future_A_time))),
      tokensInfo: toArray(poolFromRpc.tokens_info).map(({ rate_f, precision_multiplier_f, reserves }) => ({
        rateF: rate_f,
        precisionMultiplierF: precision_multiplier_f,
        reserves
      })),
      fee: {
        lpF: poolFromRpc.fee.lp_f,
        stakersF: poolFromRpc.fee.stakers_f,
        refF: poolFromRpc.fee.ref_f
      },
      stakerAccumulator: {
        accumulatorF: toArray(poolFromRpc.staker_accumulator.accumulator_f),
        totalFees: toArray(poolFromRpc.staker_accumulator.total_fees),
        totalStaked: poolFromRpc.staker_accumulator.total_staked
      },
      totalSupply: poolFromRpc.total_supply
    },
    poolFromRpc.tokens_info.size,
    devFeeF
  );
};
