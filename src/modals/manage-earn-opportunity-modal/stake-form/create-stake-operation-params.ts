import { TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { parseTransferParamsToParamsWithKind } from 'src/utils/transfer-params.utils';

import { createStableswapStakeTransfersParams } from './create-stableswap-stake-transfers-params';
import { createYouvesStakeTransfersParams } from './create-youves-stake-transfers-params';

export const createStakeOperationParams = async (
  earnOpportunity: EarnOpportunity,
  amount: BigNumber,
  asset: TokenInterface,
  tezos: TezosToolkit,
  accountPkh: string,
  stakeId?: string
) => {
  let transfersParams: TransferParams[];

  switch (earnOpportunity.type) {
    case EarnOpportunityTypeEnum.STABLESWAP:
      transfersParams = await createStableswapStakeTransfersParams(
        earnOpportunity,
        amount,
        asset,
        tezos,
        accountPkh,
        stakeId
      );
      break;
    case EarnOpportunityTypeEnum.YOUVES_SAVING:
    case EarnOpportunityTypeEnum.YOUVES_STAKING:
      transfersParams = await createYouvesStakeTransfersParams(earnOpportunity, amount, tezos, accountPkh, stakeId);
      break;
    default:
      throw new Error('Staking is not supported here yet');
  }

  return transfersParams.map(parseTransferParamsToParamsWithKind).flat();
};
