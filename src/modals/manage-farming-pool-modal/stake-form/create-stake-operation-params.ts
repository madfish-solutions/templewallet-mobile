import { TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { SingleFarmResponse } from 'src/types/single-farm-response';
import { parseTransferParamsToParamsWithKind } from 'src/utils/transfer-params.utils';

import { createLiquidityBakingStakeTransfersParams } from './create-liquidity-baking-stake-transfers-params';
import { createStableswapStakeTransfersParams } from './create-stableswap-stake-transfers-params';

export const createStakeOperationParams = async (
  farm: SingleFarmResponse,
  amount: BigNumber,
  asset: TokenInterface,
  tezos: TezosToolkit,
  account: AccountInterface,
  stakeId: string | undefined,
  slippageTolerancePercentage: number
) => {
  let transfersParams: TransferParams[] = [];

  switch (farm.item.type) {
    case FarmPoolTypeEnum.LIQUIDITY_BAKING:
      transfersParams = await createLiquidityBakingStakeTransfersParams(
        amount,
        asset,
        tezos,
        account,
        slippageTolerancePercentage
      );
      break;
    case FarmPoolTypeEnum.STABLESWAP:
      transfersParams = await createStableswapStakeTransfersParams(
        farm.item,
        amount,
        asset,
        tezos,
        account.publicKeyHash,
        stakeId
      );
      break;
    default:
      throw new Error('Unsupported farm type');
  }

  return transfersParams.map(parseTransferParamsToParamsWithKind).flat();
};
