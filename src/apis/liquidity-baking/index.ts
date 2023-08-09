import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ZERO } from 'src/config/swap';
import { EarnOpportunityTokenStandardEnum } from 'src/enums/earn-opportunity-token-standard.enum';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { LiquidityBakingStorage } from 'src/op-params/liquidity-baking/liquidity-baking-storage.interface';
import { LIQUIDITY_BAKING_DEX_ADDRESS, SIRS_TOKEN } from 'src/token/data/token-slugs';
import { SIRS_TOKEN_METADATA, TEZ_TOKEN_METADATA, TZBTC_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenMetadataInterface, TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { APPROXIMATE_DAYS_IN_YEAR, SECONDS_IN_DAY } from 'src/utils/date.utils';
import { getFirstAccountActivityTime } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';
import { tzktUrl } from 'src/utils/linking.util';
import { fetchRoute3LiquidityBakingParams } from 'src/utils/route3.util';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import {
  calculateFeeFromOutput,
  calculateRoutingInputAndFeeFromInput,
  calculateSlippageRatio
} from 'src/utils/swap.utils';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';

import {
  DEFAULT_LIQUIDITY_BAKING_SUBSIDY,
  DEFAULT_MINIMAL_BLOCK_DELAY,
  liquidityBakingStakingId,
  THREE_ROUTE_LB_TOKENS
} from './consts';
import { LiquidityBakingFarmResponse } from './types';

const getLiquidityBakingStorage = async (tezos: TezosToolkit) => {
  const contract = await getReadOnlyContract(LIQUIDITY_BAKING_DEX_ADDRESS, tezos);

  return await contract.storage<LiquidityBakingStorage>();
};

const toFarmToken = (token: TokenMetadataInterface) => ({
  contractAddress: token.address,
  type:
    token.standard === TokenStandardsEnum.Fa2
      ? EarnOpportunityTokenStandardEnum.Fa2
      : EarnOpportunityTokenStandardEnum.Fa12,
  isWhitelisted: true,
  metadata: {
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
    thumbnailUri: token.thumbnailUri
  }
});

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
      type: EarnOpportunityTypeEnum.LIQUIDITY_BAKING,
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
        type: EarnOpportunityTokenStandardEnum.Fa12,
        isWhitelisted: true,
        metadata: SIRS_TOKEN_METADATA
      },
      tokens: [toFarmToken(TEZ_TOKEN_METADATA), toFarmToken(TZBTC_TOKEN_METADATA)],
      rewardToken: toFarmToken(TEZ_TOKEN_METADATA),
      staked: lqtTotal.toFixed(),
      tvlInUsd: tvlInUsd?.toFixed() ?? null,
      tvlInStakedToken: lqtTotal.toFixed(),
      firstActivityTime: await getFirstAccountActivityTime(LIQUIDITY_BAKING_DEX_ADDRESS)
    },
    blockInfo: {
      hash,
      level,
      timestamp
    }
  };
};

export const calculateUnstakeParams = async (
  outputTokenIndexes: number[],
  lpAmount: BigNumber,
  slippageTolerancePercentage: number
) => {
  const { swapInputMinusFeeAtomic, routingFeeFromInputAtomic } = calculateRoutingInputAndFeeFromInput(lpAmount);

  return Promise.all(
    outputTokenIndexes.map(async outputTokenIndex => {
      const threeRouteOutputToken = THREE_ROUTE_LB_TOKENS[outputTokenIndex];
      const {
        output: rawOutput,
        xtzChain,
        tzbtcChain
      } = await fetchRoute3LiquidityBakingParams({
        fromSymbol: SIRS_TOKEN_METADATA.symbol,
        toSymbol: threeRouteOutputToken.symbol,
        amount: mutezToTz(swapInputMinusFeeAtomic, SIRS_TOKEN_METADATA.decimals).toFixed()
      });

      if (rawOutput === ZERO.toFixed() || !isDefined(rawOutput)) {
        throw new Error(`Failed to calculate swap params for ${threeRouteOutputToken.symbol}`);
      }

      const outputAtomic = tzToMutez(new BigNumber(rawOutput), threeRouteOutputToken.decimals)
        .times(calculateSlippageRatio(slippageTolerancePercentage))
        .integerValue(BigNumber.ROUND_DOWN);
      const routingFeeFromOutputAtomic = calculateFeeFromOutput(lpAmount, outputAtomic);
      const outputAfterFeeAtomic = outputAtomic.minus(routingFeeFromOutputAtomic);

      return {
        swapInputMinusFeeAtomic,
        routingFeeFromInputAtomic,
        threeRouteOutputToken,
        outputAtomic,
        routingFeeFromOutputAtomic,
        outputAfterFeeAtomic,
        xtzChain,
        tzbtcChain
      };
    })
  );
};
