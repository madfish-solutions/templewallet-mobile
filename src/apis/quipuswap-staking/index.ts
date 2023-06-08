import {
  ContractAbstraction,
  ContractProvider,
  MichelsonMap,
  OpKind,
  ParamsWithKind,
  TezosToolkit
} from '@taquito/taquito';
import axios from 'axios';
import { BigNumber } from 'bignumber.js';

import { toIntegerSeconds } from 'src/utils/date.utils';
import { READ_ONLY_SIGNER_PUBLIC_KEY_HASH } from 'src/utils/env.utils';
import { isDefined } from 'src/utils/is-defined';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';

import { calculateStableswapLpTokenOutput, calculateStableswapWithdrawTokenOutput } from './stableswap-calculations';
import { FarmsListResponse, StableswapPoolStorage, TooLowPoolReservesError } from './types';

const stakingApi = axios.create({ baseURL: 'https://staking-api-mainnet.prod.quipuswap.com' });

export const getV3FarmsList = async () => {
  const response = await stakingApi.get<FarmsListResponse>('/v3/multi-v2');

  return response.data.list;
};

export const getHarvestAssetsTransferParams = async (
  tezos: TezosToolkit,
  farmAddress: string,
  stakeId: BigNumber.Value
): Promise<ParamsWithKind[]> => {
  const farmingContract = await getReadOnlyContract(farmAddress, tezos);
  const claimParams = farmingContract.methods.claim(stakeId).toTransferParams();

  return [claimParams].map(transferParams => ({
    ...transferParams,
    kind: OpKind.TRANSACTION
  }));
};

const toArray = <T>(map: MichelsonMap<BigNumber, T>) =>
  Array.from(map.entries())
    .map(([key, value]): [number, T] => [key.toNumber(), value])
    .sort(([a], [b]) => a - b)
    .map(([, value]) => value);

const getStableswapPool = async (
  tezos: TezosToolkit,
  stableswapContract: ContractAbstraction<ContractProvider>,
  poolId: number
) => {
  const { storage: internalPoolStorage } = await stableswapContract.storage<StableswapPoolStorage>();
  const { pools: poolsFromRpc, factory_address } = internalPoolStorage;
  const poolFromRpc = await poolsFromRpc.get(new BigNumber(poolId));
  const factoryContract = await getReadOnlyContract(factory_address, tezos);
  const devFeeF = await factoryContract.contractViews
    .dev_fee()
    .executeView({ viewCaller: READ_ONLY_SIGNER_PUBLIC_KEY_HASH });

  if (!isDefined(poolFromRpc)) {
    throw new Error(`Pool with id ${poolId} not found`);
  }

  return {
    devFeeF,
    pool: {
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
    }
  };
};

export const estimateWithdrawTokenOutput = async (
  tezos: TezosToolkit,
  stableswapContract: ContractAbstraction<ContractProvider>,
  tokenIndexes: number[],
  shares: BigNumber,
  poolId: number
) => {
  const { devFeeF, pool } = await getStableswapPool(tezos, stableswapContract, poolId);

  return tokenIndexes.map(tokenIndex => {
    try {
      return calculateStableswapWithdrawTokenOutput(shares, tokenIndex, pool, devFeeF);
    } catch (error) {
      return error instanceof TooLowPoolReservesError ? null : undefined;
    }
  });
};

export const estimateStableswapLpTokenOutput = async (
  tezos: TezosToolkit,
  stableswapContract: ContractAbstraction<ContractProvider>,
  investedTokenIndex: number,
  amount: BigNumber,
  poolId: number
) => {
  const { devFeeF, pool } = await getStableswapPool(tezos, stableswapContract, poolId);

  return calculateStableswapLpTokenOutput(
    Array(pool.tokensInfo.length)
      .fill(new BigNumber(0))
      .map((_, index) => (index === investedTokenIndex ? amount : new BigNumber(0))),
    pool,
    pool.tokensInfo.length,
    devFeeF
  );
};
