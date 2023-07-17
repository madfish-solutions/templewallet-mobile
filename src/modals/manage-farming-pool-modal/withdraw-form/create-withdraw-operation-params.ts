import { TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { SingleFarmResponse } from 'src/types/single-farm-response';
import { parseTransferParamsToParamsWithKind } from 'src/utils/transfer-params.utils';

import { createLiquidityBakingWithdrawTransfersParams } from './create-liquidity-baking-withdraw-transfers-params';
import { createStableswapWithdrawTransfersParams } from './create-stableswap-withdraw-transfers-params';

export const createWithdrawOperationParams = async (
  farm: SingleFarmResponse,
  tokenIndex: number,
  tezos: TezosToolkit,
  account: AccountInterface,
  stake: UserStakeValueInterface,
  slippageTolerancePercentage: number,
  lpAmount?: BigNumber
) => {
  const { publicKeyHash: accountPkh } = account;
  let transfersParams: TransferParams[] = [];

  switch (farm.item.type) {
    case FarmPoolTypeEnum.LIQUIDITY_BAKING:
      transfersParams = await createLiquidityBakingWithdrawTransfersParams(
        farm.item,
        tokenIndex,
        tezos,
        account,
        stake,
        slippageTolerancePercentage,
        lpAmount
      );
      break;
    case FarmPoolTypeEnum.STABLESWAP:
      transfersParams = await createStableswapWithdrawTransfersParams(farm.item, tokenIndex, tezos, accountPkh, stake);
      break;
    default:
      throw new Error('Unsupported farm type');
  }

  return transfersParams.map(parseTransferParamsToParamsWithKind).flat();
};
