import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { calculateUnstakeParams } from 'src/apis/liquidity-baking';
import { ROUTING_FEE_ADDRESS } from 'src/config/swap';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { THREE_ROUTE_SIRS_TOKEN } from 'src/token/data/three-route-tokens';
import { percentageToFraction } from 'src/utils/percentage.utils';
import { calculateSlippageRatio, getRoutingFeeTransferParams, getSwapTransferParams } from 'src/utils/swap.utils';

export const createLiquidityBakingWithdrawTransfersParams = async (
  tokenIndex: number,
  tezos: TezosToolkit,
  accountPkh: string,
  stake: UserStakeValueInterface,
  slippageTolerancePercentage: number,
  percentage: number
) => {
  const lpAmount = new BigNumber(stake.depositAmountAtomic ?? 0)
    .times(percentageToFraction(percentage))
    .integerValue(BigNumber.ROUND_DOWN);
  const [
    {
      swapInputMinusFeeAtomic,
      routingFeeFromInputAtomic,
      threeRouteOutputToken,
      expectedOutputAtomic,
      routingFeeFromOutputAtomic,
      minOutputAtomic,
      outputAfterFeeAtomic,
      ...hops
    }
  ] = await calculateUnstakeParams([tokenIndex], lpAmount, slippageTolerancePercentage, tezos.rpc.getRpcUrl());

  const transferFeeFromInputParams = await getRoutingFeeTransferParams(
    THREE_ROUTE_SIRS_TOKEN,
    routingFeeFromInputAtomic,
    accountPkh,
    ROUTING_FEE_ADDRESS,
    tezos
  );

  const transferFeeFromOutputParams = await getRoutingFeeTransferParams(
    threeRouteOutputToken,
    routingFeeFromOutputAtomic,
    accountPkh,
    ROUTING_FEE_ADDRESS,
    tezos
  );

  const threeRouteSwapOpParams = await getSwapTransferParams(
    THREE_ROUTE_SIRS_TOKEN,
    threeRouteOutputToken,
    swapInputMinusFeeAtomic,
    expectedOutputAtomic,
    calculateSlippageRatio(slippageTolerancePercentage),
    hops,
    tezos,
    accountPkh
  );

  return [...transferFeeFromInputParams, ...threeRouteSwapOpParams, ...transferFeeFromOutputParams];
};
