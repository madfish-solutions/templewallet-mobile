import { BigNumber } from 'bignumber.js';

import { MAIN_SIRS_SWAP_MAX_DEXES } from 'src/config/swap';
import { EarnOpportunityTokenStandardEnum } from 'src/enums/earn-opportunity-token-standard.enum';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { LIQUIDITY_BAKING_DEX_ADDRESS, SIRS_TOKEN } from 'src/token/data/token-slugs';
import { SIRS_TOKEN_METADATA, TEZ_TOKEN_METADATA, TZBTC_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenMetadataInterface, TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { getFirstAccountActivityTime } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';
import { tzktUrl } from 'src/utils/linking';
import { ZERO } from 'src/utils/number.util';
import { fetchRoute3LiquidityBakingParams } from 'src/utils/route3.util';
import { TEMPLE_RPC } from 'src/utils/rpc/rpc-list';
import {
  calculateSidePaymentsFromInput,
  calculateOutputFeeAtomic,
  calculateSlippageRatio,
  multiplyAtomicAmount
} from 'src/utils/swap.utils';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';

import { getLiquidityBakingStats } from '../temple-wallet';

import { liquidityBakingStakingId, THREE_ROUTE_LB_TOKENS } from './consts';
import { LiquidityBakingFarmResponse } from './types';

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

export const getLiquidityBakingFarm = async (): Promise<LiquidityBakingFarmResponse> => {
  const { stats, blockInfo } = await getLiquidityBakingStats();

  return {
    item: {
      type: EarnOpportunityTypeEnum.LIQUIDITY_BAKING,
      id: liquidityBakingStakingId,
      depositTokenUrl: `${tzktUrl(TEMPLE_RPC.url, SIRS_TOKEN.address)}`,
      stakeUrl: `${tzktUrl(TEMPLE_RPC.url, LIQUIDITY_BAKING_DEX_ADDRESS)}`,
      stakedToken: {
        contractAddress: SIRS_TOKEN.address,
        type: EarnOpportunityTokenStandardEnum.Fa12,
        isWhitelisted: true,
        metadata: SIRS_TOKEN_METADATA
      },
      tokens: [toFarmToken(TEZ_TOKEN_METADATA), toFarmToken(TZBTC_TOKEN_METADATA)],
      rewardToken: toFarmToken(TEZ_TOKEN_METADATA),
      firstActivityTime: await getFirstAccountActivityTime(LIQUIDITY_BAKING_DEX_ADDRESS),
      ...stats
    },
    blockInfo
  };
};

export const calculateUnstakeParams = async (
  outputTokenIndexes: number[],
  lpAmount: BigNumber,
  slippageTolerancePercentage: number,
  rpcUrl: string
) => {
  const { swapInputMinusFeeAtomic, inputFeeAtomic: routingFeeFromInputAtomic } =
    calculateSidePaymentsFromInput(lpAmount);

  return Promise.all(
    outputTokenIndexes.map(async outputTokenIndex => {
      const threeRouteOutputToken = THREE_ROUTE_LB_TOKENS[outputTokenIndex];
      const {
        input,
        output: rawOutput,
        ...hops
      } = await fetchRoute3LiquidityBakingParams({
        fromSymbol: SIRS_TOKEN_METADATA.symbol,
        toSymbol: threeRouteOutputToken.symbol,
        toTokenDecimals: threeRouteOutputToken.decimals,
        amount: mutezToTz(swapInputMinusFeeAtomic, SIRS_TOKEN_METADATA.decimals).toFixed(),
        // Such swap has either XTZ or tzBTC hops
        xtzDexesLimit: MAIN_SIRS_SWAP_MAX_DEXES,
        tzbtcDexesLimit: MAIN_SIRS_SWAP_MAX_DEXES,
        rpcUrl,
        showTree: true
      });

      if (rawOutput === ZERO.toFixed() || !isDefined(rawOutput)) {
        throw new Error(`Failed to calculate swap params for ${threeRouteOutputToken.symbol}`);
      }

      const expectedOutputAtomic = tzToMutez(new BigNumber(rawOutput), threeRouteOutputToken.decimals);
      const minOutputAtomic = multiplyAtomicAmount(
        expectedOutputAtomic,
        calculateSlippageRatio(slippageTolerancePercentage),
        BigNumber.ROUND_DOWN
      );
      const routingFeeFromOutputAtomic = calculateOutputFeeAtomic(lpAmount, minOutputAtomic);
      const outputAfterFeeAtomic = minOutputAtomic.minus(routingFeeFromOutputAtomic);

      return {
        swapInputMinusFeeAtomic,
        routingFeeFromInputAtomic,
        threeRouteOutputToken,
        expectedOutputAtomic,
        minOutputAtomic,
        routingFeeFromOutputAtomic,
        outputAfterFeeAtomic,
        ...hops
      };
    })
  );
};
