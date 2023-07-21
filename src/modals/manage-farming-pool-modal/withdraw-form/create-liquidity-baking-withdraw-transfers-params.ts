import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom } from 'rxjs';

import { calculateUnstakeParams } from 'src/apis/liquidity-baking';
import { LiquidityBakingFarm } from 'src/apis/liquidity-baking/types';
import { ROUTING_FEE_ADDRESS } from 'src/config/swap';
import { AccountInterface } from 'src/interfaces/account.interface';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { THREE_ROUTE_SIRS_TOKEN } from 'src/token/data/three-route-tokens';
import { getSwapTransferParams } from 'src/utils/swap.utils';
import { getTransferParams$ } from 'src/utils/transfer-params.utils';

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
  const [{ threeRouteOutputToken, outputAtomic, routingFeeFromOutputAtomic, xtzChain, tzbtcChain }] =
    await calculateUnstakeParams([tokenIndex], lpAmountWithDefault, slippageTolerancePercentage);

  const transferDevFeeParams = await firstValueFrom(
    getTransferParams$(
      { address: threeRouteOutputToken.contract ?? '', id: Number(threeRouteOutputToken.tokenId ?? '0') },
      tezos.rpc.getRpcUrl(),
      account,
      ROUTING_FEE_ADDRESS,
      routingFeeFromOutputAtomic
    )
  );

  const threeRouteSwapOpParams = await getSwapTransferParams(
    THREE_ROUTE_SIRS_TOKEN,
    threeRouteOutputToken,
    lpAmountWithDefault,
    outputAtomic,
    { xtzChain, tzbtcChain },
    tezos,
    accountPkh
  );

  return [...threeRouteSwapOpParams, transferDevFeeParams];
};
