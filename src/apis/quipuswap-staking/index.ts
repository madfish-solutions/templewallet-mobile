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

import { LiquidityBakingStorage } from 'src/op-params/liquidity-baking/liquidity-baking-storage.interface';
import { LIQUIDITY_BAKING_DEX_ADDRESS, SIRS_TOKEN } from 'src/token/data/token-slugs';
import { TEZ_TOKEN_METADATA, TZBTC_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenMetadataInterface, TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { APPROXIMATE_DAYS_IN_YEAR, SECONDS_IN_DAY, toIntegerSeconds } from 'src/utils/date.utils';
import { READ_ONLY_SIGNER_PUBLIC_KEY_HASH } from 'src/utils/env.utils';
import { isDefined } from 'src/utils/is-defined';
import { tzktUrl } from 'src/utils/linking.util';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { mutezToTz } from 'src/utils/tezos.util';

import { liquidityBakingStakingId } from './consts';
import { calculateStableswapLpTokenOutput, calculateStableswapWithdrawTokenOutput } from './stableswap-calculations';
import {
  FarmsListResponse,
  FarmTokenStandardsEnum,
  LiquidityBakingFarmResponse,
  PoolType,
  StableswapPoolStorage,
  TooLowPoolReservesError
} from './types';

const DEFAULT_LIQUIDITY_BAKING_SUBSIDY = new BigNumber(1250000);
const DEFAULT_MINIMAL_BLOCK_DELAY = new BigNumber(15);
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

const toFarmToken = (token: TokenMetadataInterface) => ({
  contractAddress: token.address,
  type: token.standard === TokenStandardsEnum.Fa2 ? FarmTokenStandardsEnum.Fa2 : FarmTokenStandardsEnum.Fa12,
  isWhitelisted: true,
  metadata: {
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
    thumbnailUri: token.thumbnailUri
  }
});

export const getLiquidityBakingStorage = async (tezos: TezosToolkit) => {
  const contract = await getReadOnlyContract(LIQUIDITY_BAKING_DEX_ADDRESS, tezos);

  return await contract.storage<LiquidityBakingStorage>();
};

export const getLiquidityBakingFarm = async (
  tezos: TezosToolkit,
  tezExchangeRate?: number,
  tzbtcExchangeRate?: number
): Promise<LiquidityBakingFarmResponse> => {
  const { xtzPool, tokenPool, lqtTotal } = await getLiquidityBakingStorage(tezos);
  const {
    liquidity_baking_subsidy: subsidyPerBlock = DEFAULT_LIQUIDITY_BAKING_SUBSIDY,
    minimal_block_delay: blockPeriod = DEFAULT_MINIMAL_BLOCK_DELAY
  } = await tezos.rpc.getConstants();
  const dailyDistributionAtomic = subsidyPerBlock.times(SECONDS_IN_DAY).div(blockPeriod);
  const dailyDistribution = mutezToTz(dailyDistributionAtomic, TEZ_TOKEN_METADATA.decimals);
  const annualSubsidy = dailyDistributionAtomic.times(APPROXIMATE_DAYS_IN_YEAR);

  const tezosPoolInTokens = mutezToTz(xtzPool, TEZ_TOKEN_METADATA.decimals);
  const tzBtcPoolInTokens = mutezToTz(tokenPool, TZBTC_TOKEN_METADATA.decimals);
  const tvlInUsd =
    isDefined(tezExchangeRate) && isDefined(tzbtcExchangeRate)
      ? tezosPoolInTokens.times(tezExchangeRate).plus(tzBtcPoolInTokens.times(tzbtcExchangeRate))
      : null;
  const depositExchangeRate = isDefined(tvlInUsd) && lqtTotal.isGreaterThan(0) ? tvlInUsd.div(lqtTotal) : null;
  const { hash, level, timestamp } = await tezos.rpc.getBlockHeader();

  return {
    item: {
      type: PoolType.LIQUIDITY_BAKING,
      id: liquidityBakingStakingId,
      contractAddress: LIQUIDITY_BAKING_DEX_ADDRESS,
      apr: xtzPool.plus(annualSubsidy).div(xtzPool).minus(1).div(2).times(100).toFixed(),
      depositExchangeRate: depositExchangeRate?.toFixed() ?? null,
      depositTokenUrl: `${tzktUrl(tezos.rpc.getRpcUrl(), SIRS_TOKEN.address)}`,
      dailyDistribution: dailyDistribution.toFixed(),
      dailyDistributionDollarEquivalent: isDefined(tezExchangeRate)
        ? dailyDistribution.times(tezExchangeRate).toFixed()
        : '0',
      earnExchangeRate: tezExchangeRate?.toString() ?? null,
      vestingPeriodSeconds: '0',
      stakeUrl: `${tzktUrl(tezos.rpc.getRpcUrl(), LIQUIDITY_BAKING_DEX_ADDRESS)}`,
      stakedToken: {
        contractAddress: SIRS_TOKEN.address,
        type: FarmTokenStandardsEnum.Fa12,
        isWhitelisted: true,
        metadata: {
          decimals: 0,
          symbol: 'SIRS',
          name: 'Sirius',
          thumbnailUri: 'ipfs://QmNXQPkRACxaR17cht5ZWaaKiQy46qfCwNVT5FGZy6qnyp'
        }
      },
      tokens: [toFarmToken(TEZ_TOKEN_METADATA), toFarmToken(TZBTC_TOKEN_METADATA)],
      rewardToken: toFarmToken(TEZ_TOKEN_METADATA),
      staked: lqtTotal.toFixed(),
      tvlInUsd: tvlInUsd?.toFixed() ?? null,
      tvlInStakedToken: lqtTotal.toFixed()
    },
    blockInfo: {
      hash,
      level,
      timestamp
    }
  };
};
