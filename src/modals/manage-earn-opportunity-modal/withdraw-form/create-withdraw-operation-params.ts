import { TezosToolkit, TransferParams } from '@taquito/taquito';

import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { getKordFiWithdrawTransferParams } from 'src/modals/manage-earn-opportunity-modal/withdraw-form/create-kordfi-withdraw-transfer-params';
import { EarnOpportunity } from 'src/types/earn-opportunity.types';
import { parseTransferParamsToParamsWithKind } from 'src/utils/transfer-params.utils';

import { createLiquidityBakingWithdrawTransfersParams } from './create-liquidity-baking-withdraw-transfers-params';
import { createStableswapWithdrawTransfersParams } from './create-stableswap-withdraw-transfers-params';
import { createYouvesWithdrawTransfersParams } from './create-youves-withdraw-transfers-params';

export const createWithdrawOperationParams = async (
  earnOpportunity: EarnOpportunity,
  tokenIndex: number,
  tezos: TezosToolkit,
  accountPkh: string,
  stake: UserStakeValueInterface,
  percentage: number,
  slippageTolerancePercentage: number
) => {
  let transfersParams: TransferParams[];

  switch (earnOpportunity.type) {
    case EarnOpportunityTypeEnum.LIQUIDITY_BAKING:
      transfersParams = await createLiquidityBakingWithdrawTransfersParams(
        tokenIndex,
        tezos,
        accountPkh,
        stake,
        slippageTolerancePercentage,
        percentage
      );
      break;
    case EarnOpportunityTypeEnum.KORD_FI_SAVING:
      transfersParams = await getKordFiWithdrawTransferParams(earnOpportunity, percentage, tezos, stake);
      break;
    case EarnOpportunityTypeEnum.STABLESWAP:
      transfersParams = await createStableswapWithdrawTransfersParams(
        earnOpportunity,
        tokenIndex,
        tezos,
        accountPkh,
        stake
      );
      break;
    case EarnOpportunityTypeEnum.YOUVES_SAVING:
    case EarnOpportunityTypeEnum.YOUVES_STAKING:
      transfersParams = await createYouvesWithdrawTransfersParams(earnOpportunity, tezos, stake, percentage);
      break;
    default:
      throw new Error('Withdrawal is not supported here yet');
  }

  return transfersParams.map(parseTransferParamsToParamsWithKind).flat();
};
