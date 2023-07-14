import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom } from 'rxjs';

import { MAX_ROUTING_FEE_CHAINS, ROUTING_FEE_PERCENT, ZERO } from 'src/config/swap';
import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { FarmTokenStandardEnum } from 'src/enums/farm-token-standard.enum';
import { LiquidityBakingStorage } from 'src/op-params/liquidity-baking/liquidity-baking-storage.interface';
import { LIQUIDITY_BAKING_DEX_ADDRESS, SIRS_TOKEN } from 'src/token/data/token-slugs';
import { TEZ_TOKEN_METADATA, TZBTC_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenMetadataInterface, TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { APPROXIMATE_DAYS_IN_YEAR, SECONDS_IN_DAY } from 'src/utils/date.utils';
import { getFirstAccountActivityTime } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';
import { tzktUrl } from 'src/utils/linking.util';
import { fetchRoute3SwapParams, fetchRoute3Tokens$ } from 'src/utils/route3.util';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { calculateSlippageRatio } from 'src/utils/swap.utils';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';

import { DEFAULT_LIQUIDITY_BAKING_SUBSIDY, DEFAULT_MINIMAL_BLOCK_DELAY, liquidityBakingStakingId } from './consts';
import { LiquidityBakingFarmResponse } from './types';

const getLiquidityBakingStorage = async (tezos: TezosToolkit) => {
  const contract = await getReadOnlyContract(LIQUIDITY_BAKING_DEX_ADDRESS, tezos);

  return await contract.storage<LiquidityBakingStorage>();
};

const toFarmToken = (token: TokenMetadataInterface) => ({
  contractAddress: token.address,
  type: token.standard === TokenStandardsEnum.Fa2 ? FarmTokenStandardEnum.Fa2 : FarmTokenStandardEnum.Fa12,
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
      type: FarmPoolTypeEnum.LIQUIDITY_BAKING,
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
        type: FarmTokenStandardEnum.Fa12,
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

export const getThreeRouteLbTokens = async () => {
  const allTokens = await firstValueFrom(fetchRoute3Tokens$());
  const tezToken = allTokens.find(({ symbol }) => symbol.toLowerCase() === 'xtz');
  const tzBTCToken = allTokens.find(({ symbol }) => symbol.toLowerCase() === 'tzbtc');
  const sirsToken = allTokens.find(({ symbol }) => symbol.toLowerCase() === 'sirs');

  if (!isDefined(tezToken) || !isDefined(tzBTCToken) || !isDefined(sirsToken)) {
    throw new Error('Failed to find at least one of XTZ, tzBTC and SIRS tokens in Route3 tokens list');
  }

  return { tezToken, tzBTCToken, sirsToken };
};

export const calculateUnstakeParams = async (
  tezos: TezosToolkit,
  outputTokenIndexes: number[],
  lpAmount: BigNumber,
  slippageTolerancePercentage: number
) => {
  const { xtzPool, tokenPool, lqtTotal } = await getLiquidityBakingStorage(tezos);
  const divestMutezAmount = xtzPool.times(lpAmount).dividedToIntegerBy(lqtTotal);
  const divestTzBTCAmount = tokenPool.times(lpAmount).dividedToIntegerBy(lqtTotal);

  const { tezToken, tzBTCToken } = await getThreeRouteLbTokens();

  const outputTokenIndexDependentParams = await Promise.all(
    outputTokenIndexes.map(async outputTokenIndex => {
      const threeRouteFromToken = outputTokenIndex === 0 ? tzBTCToken : tezToken;
      const threeRouteToToken = outputTokenIndex === 0 ? tezToken : tzBTCToken;
      const swapInputAtomic = outputTokenIndex === 0 ? divestTzBTCAmount : divestMutezAmount;
      const directDivestOutputAtomic = outputTokenIndex === 0 ? divestMutezAmount : divestTzBTCAmount;
      const { chains: swapParamsChains, output: rawSwapOutput } = await fetchRoute3SwapParams({
        fromSymbol: threeRouteFromToken.symbol,
        toSymbol: threeRouteToToken.symbol,
        amount: mutezToTz(swapInputAtomic, threeRouteFromToken.decimals).toFixed(),
        chainsLimit: MAX_ROUTING_FEE_CHAINS
      });
      const slippageRatio = calculateSlippageRatio(slippageTolerancePercentage);

      if (!isDefined(rawSwapOutput) || rawSwapOutput === ZERO.toFixed()) {
        throw new Error(`Cannot swap ${threeRouteFromToken.symbol} to ${threeRouteToToken.symbol}`);
      }

      const swapOutputAtomic = tzToMutez(new BigNumber(rawSwapOutput), threeRouteToToken.decimals)
        .times(slippageRatio)
        .integerValue(BigNumber.ROUND_DOWN);
      const routingFeeAtomic = directDivestOutputAtomic
        .plus(swapOutputAtomic)
        .times(ROUTING_FEE_PERCENT)
        .div(100)
        .integerValue(BigNumber.ROUND_UP);

      return {
        threeRouteFromToken,
        threeRouteToToken,
        swapToOutputTokenInput: swapInputAtomic,
        routingFeeAtomic,
        swapParamsChains,
        swapOutputAtomic,
        directDivestOutputAtomic
      };
    })
  );

  return {
    divestMutezAmount,
    divestTzBTCAmount,
    outputTokenIndexDependentParams
  };
};
