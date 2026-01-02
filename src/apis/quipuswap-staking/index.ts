import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import axios from 'axios';
import { BigNumber } from 'bignumber.js';

import { toIntegerSeconds } from 'src/utils/date.utils';
import { getFirstAccountActivityTime } from 'src/utils/earn.utils';
import { READ_ONLY_SIGNER_PUBLIC_KEY_HASH, TEMPLE_WALLET_STAKING_API_URL } from 'src/utils/env.utils';
import { AnalyticsError } from 'src/utils/error-analytics-data.utils';
import { isDefined } from 'src/utils/is-defined';
import { getReadOnlyContract, getContractStorage } from 'src/utils/rpc/contract.utils';
import { parseTransferParamsToParamsWithKind } from 'src/utils/transfer-params.utils';

import { calculateStableswapLpTokenOutput, calculateStableswapWithdrawTokenOutput } from './stableswap-calculations';
import { FarmsListResponse, StableswapPoolStorage, TooLowPoolReservesError } from './types';

const stakingApi = axios.create({ baseURL: TEMPLE_WALLET_STAKING_API_URL });

export const getV3FarmsList = async () => {
  const fetchedData: Record<string, unknown> = {};
  try {
    const response = await stakingApi.get<FarmsListResponse>('/v3/multi-v2');
    fetchedData.farmsListResponse = response.data;
    const firstActivityTimestamps = await Promise.all(
      response.data.list.map(({ item }) => getFirstAccountActivityTime(item.contractAddress))
    );
    fetchedData.firstActivityTimestamps = firstActivityTimestamps;

    return response.data.list.map(({ item, ...rest }, index) => ({
      ...rest,
      item: {
        ...item,
        tokens: item.tokens.map(({ contractAddress, ...rest }) => ({
          ...rest,
          contractAddress: contractAddress === 'tez' ? '' : contractAddress
        })),
        firstActivityTime: firstActivityTimestamps[index]
      }
    }));
  } catch (error) {
    throw new AnalyticsError(error, [], { fetchedData });
  }
};

export const getHarvestAssetsTransferParams = async (
  tezos: TezosToolkit,
  farmAddress: string,
  stakeId: BigNumber.Value
) => {
  const farmingContract = await getReadOnlyContract(farmAddress, tezos);
  const claimParams = farmingContract.methods.claim(stakeId).toTransferParams();

  return parseTransferParamsToParamsWithKind(claimParams);
};

const toArray = <T>(map: MichelsonMap<BigNumber, T>) =>
  Array.from(map.entries())
    .map(([key, value]): [number, T] => [key.toNumber(), value])
    .sort(([a], [b]) => a - b)
    .map(([, value]) => value);

const getStableswapPool = async (tezos: TezosToolkit, stableswapContractAddress: string, poolId: number) => {
  const fetchedData: Record<string, unknown> = {};
  try {
    const { storage: internalPoolStorage } = await getContractStorage<StableswapPoolStorage>(
      tezos,
      stableswapContractAddress
    );
    const { pools: poolsFromRpc, factory_address } = internalPoolStorage;
    fetchedData.factoryAddress = factory_address;
    const poolFromRpc = await poolsFromRpc.get(new BigNumber(poolId));
    fetchedData.poolFromRpc = poolFromRpc;
    const factoryContract = await getReadOnlyContract(factory_address, tezos);
    const devFee = await factoryContract.contractViews
      .dev_fee()
      .executeView({ viewCaller: READ_ONLY_SIGNER_PUBLIC_KEY_HASH });
    fetchedData.devFee = devFee;

    if (!isDefined(poolFromRpc)) {
      throw new Error(`Pool with id ${poolId} not found`);
    }

    return {
      devFee,
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
  } catch (error) {
    throw new AnalyticsError(error, [], {
      getStableswapPoolInput: { rpcUrl: tezos.rpc.getRpcUrl(), stableswapContractAddress, poolId },
      fetchedData
    });
  }
};

/**
 * Estimates the amounts of tokens that will be received after divesting the given amount of shares, expecting to receive one token each time
 * @param tezos Tezos toolkit instance
 * @param stableswapContractAddress Address of stableswap pool contract
 * @param tokenIndexes Indexes of tokens
 * @param shares Amount of shares
 * @param poolId Stableswap pool id
 * @returns Array of amounts of tokens that will be received. If reserves are too low, `null` is returned for the corresponding token index. If the
 * estimation fails for any other reason, `undefined` is returned for the corresponding token index.
 */
export const estimateDivestOneCoinOutputs = async (
  tezos: TezosToolkit,
  stableswapContractAddress: string,
  tokenIndexes: number[],
  shares: BigNumber,
  poolId: number
) => {
  const { devFee, pool } = await getStableswapPool(tezos, stableswapContractAddress, poolId);

  try {
    return tokenIndexes.map(tokenIndex => {
      try {
        return calculateStableswapWithdrawTokenOutput(shares, tokenIndex, pool, devFee);
      } catch (error) {
        return error instanceof TooLowPoolReservesError ? null : undefined;
      }
    });
  } catch (error) {
    throw new AnalyticsError(error, [], {
      estimateDivestOneCoinOutputsInput: {
        rpcUrl: tezos.rpc.getRpcUrl(),
        stableswapContractAddress,
        tokenIndexes,
        shares,
        poolId
      }
    });
  }
};

export const estimateStableswapLpTokenOutput = async (
  tezos: TezosToolkit,
  stableswapContractAddress: string,
  investedTokenIndex: number,
  amount: BigNumber,
  poolId: number
) => {
  const { devFee, pool } = await getStableswapPool(tezos, stableswapContractAddress, poolId);

  try {
    return calculateStableswapLpTokenOutput(
      Array(pool.tokensInfo.length)
        .fill(new BigNumber(0))
        .map((_, index) => (index === investedTokenIndex ? amount : new BigNumber(0))),
      pool,
      pool.tokensInfo.length,
      devFee
    );
  } catch (error) {
    throw new AnalyticsError(error, [], {
      estimateStableswapLpTokenOutputInput: {
        rpcUrl: tezos.rpc.getRpcUrl(),
        stableswapContractAddress,
        investedTokenIndex,
        amount,
        poolId
      }
    });
  }
};
