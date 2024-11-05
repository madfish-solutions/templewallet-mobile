import { TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { Route3Token } from 'src/interfaces/route3.interface';
import { createKordFiStakeTransfersParams } from 'src/modals/manage-earn-opportunity-modal/stake-form/create-kord-fi-deposit-tranfer-params';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { EarnOpportunity } from 'src/types/earn-opportunity.types';
import { parseTransferParamsToParamsWithKind } from 'src/utils/transfer-params.utils';

import { createLiquidityBakingStakeTransfersParams } from './create-liquidity-baking-stake-transfers-params';
import { createStableswapStakeTransfersParams } from './create-stableswap-stake-transfers-params';
import { createYouvesStakeTransfersParams } from './create-youves-stake-transfers-params';

export const createStakeOperationParams = async (
  earnOpportunity: EarnOpportunity,
  amount: BigNumber,
  asset: TokenInterface,
  tezos: TezosToolkit,
  accountPkh: string,
  stakeId: string | undefined,
  threeRouteTokens: Route3Token[],
  slippageTolerancePercentage: number
) => {
  let transfersParams: TransferParams[];

  switch (earnOpportunity.type) {
    case EarnOpportunityTypeEnum.LIQUIDITY_BAKING:
      transfersParams = await createLiquidityBakingStakeTransfersParams(
        amount,
        asset,
        tezos,
        accountPkh,
        slippageTolerancePercentage,
        tezos.rpc.getRpcUrl()
      );
      break;
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
    case EarnOpportunityTypeEnum.KORD_FI_SAVING:
      transfersParams = await createKordFiStakeTransfersParams(
        earnOpportunity,
        amount,
        asset,
        tezos,
        accountPkh,
        threeRouteTokens,
        slippageTolerancePercentage
      );
      break;
    case EarnOpportunityTypeEnum.YOUVES_SAVING:
    case EarnOpportunityTypeEnum.YOUVES_STAKING:
      transfersParams = await createYouvesStakeTransfersParams(
        earnOpportunity,
        amount,
        asset,
        tezos,
        accountPkh,
        stakeId,
        threeRouteTokens,
        slippageTolerancePercentage
      );
      break;
    default:
      throw new Error('Staking is not supported here yet');
  }

  return transfersParams.map(parseTransferParamsToParamsWithKind).flat();
};
