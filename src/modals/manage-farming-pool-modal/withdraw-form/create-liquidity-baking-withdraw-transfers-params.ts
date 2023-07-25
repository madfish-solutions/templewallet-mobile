import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { calculateUnstakeParams } from 'src/apis/liquidity-baking';
import { LiquidityBakingFarm } from 'src/apis/liquidity-baking/types';
import { ROUTING_FEE_ADDRESS } from 'src/config/swap';
import { AccountInterface } from 'src/interfaces/account.interface';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { THREE_ROUTE_SIRS_TOKEN } from 'src/token/data/three-route-tokens';
import { getRoutingFeeTransferParams, getSwapTransferParams } from 'src/utils/swap.utils';

export const createLiquidityBakingWithdrawTransfersParams = async (
  farm: LiquidityBakingFarm,
  tokenIndex: number,
  tezos: TezosToolkit,
  account: AccountInterface,
  stake: UserStakeValueInterface,
  slippageTolerancePercentage: number,
  lpAmount?: BigNumber
) => {
  const { publicKeyHash: accountPkh } = account;
  const lpAmountWithDefault = lpAmount ?? new BigNumber(stake.depositAmountAtomic ?? 0);
  const [
    {
      swapInputMinusFeeAtomic,
      routingFeeFromInputAtomic,
      threeRouteOutputToken,
      outputAtomic,
      routingFeeFromOutputAtomic,
      xtzChain,
      tzbtcChain
    }
  ] = await calculateUnstakeParams([tokenIndex], lpAmountWithDefault, slippageTolerancePercentage);

  const transferFeeFromInputParams = await getRoutingFeeTransferParams(
    THREE_ROUTE_SIRS_TOKEN,
    routingFeeFromInputAtomic,
    account.publicKeyHash,
    ROUTING_FEE_ADDRESS,
    tezos
  );

  const transferFeeFromOutputParams = await getRoutingFeeTransferParams(
    threeRouteOutputToken,
    routingFeeFromOutputAtomic,
    account.publicKeyHash,
    ROUTING_FEE_ADDRESS,
    tezos
  );

  const threeRouteSwapOpParams = await getSwapTransferParams(
    THREE_ROUTE_SIRS_TOKEN,
    threeRouteOutputToken,
    swapInputMinusFeeAtomic,
    outputAtomic,
    { xtzChain, tzbtcChain },
    tezos,
    accountPkh
  );

  return [...transferFeeFromInputParams, ...threeRouteSwapOpParams, ...transferFeeFromOutputParams];
};
