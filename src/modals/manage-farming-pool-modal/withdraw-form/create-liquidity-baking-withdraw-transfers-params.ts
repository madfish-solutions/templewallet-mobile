import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom } from 'rxjs';

import { calculateUnstakeParams } from 'src/apis/liquidity-baking';
import { LiquidityBakingFarm } from 'src/apis/liquidity-baking/types';
import { ROUTE3_CONTRACT, ROUTING_FEE_ADDRESS } from 'src/config/swap';
import { AccountInterface } from 'src/interfaces/account.interface';
import { getTransactionTimeoutDate } from 'src/op-params/op-params.utils';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
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
  const poolContract = await getReadOnlyContract(farm.contractAddress, tezos);
  const lpAmountWithDefault = lpAmount ?? new BigNumber(stake.depositAmountAtomic ?? 0);
  const { divestMutezAmount, divestTzBTCAmount, outputTokenIndexDependentParams } = await calculateUnstakeParams(
    tezos,
    [tokenIndex],
    lpAmountWithDefault,
    slippageTolerancePercentage
  );
  const [
    {
      threeRouteFromToken,
      threeRouteToToken,
      swapToOutputTokenInput,
      routingFeeAtomic,
      swapParamsChains,
      swapOutputAtomic
    }
  ] = outputTokenIndexDependentParams;

  const removeLiquidityParams = poolContract.methods
    .removeLiquidity(accountPkh, lpAmountWithDefault, divestMutezAmount, divestTzBTCAmount, getTransactionTimeoutDate())
    .toTransferParams({ mutez: true });

  const transferDevFeeParams = await firstValueFrom(
    getTransferParams$(
      { address: threeRouteToToken.contract ?? '', id: 0 },
      tezos.rpc.getRpcUrl(),
      account,
      ROUTING_FEE_ADDRESS,
      routingFeeAtomic
    )
  );

  const swapContract = await getReadOnlyContract(ROUTE3_CONTRACT, tezos);
  const threeRouteSwapOpParams = await getSwapTransferParams(
    threeRouteFromToken,
    threeRouteToToken,
    swapToOutputTokenInput,
    swapOutputAtomic,
    swapParamsChains,
    tezos,
    accountPkh,
    swapContract
  );

  return [removeLiquidityParams, transferDevFeeParams, ...threeRouteSwapOpParams];
};
