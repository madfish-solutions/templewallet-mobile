import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { EarnOpportunityTokenStandardEnum } from 'src/enums/earn-opportunity-token-standard.enum';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { getTransferPermissions } from 'src/utils/transfer-permissions.util';

export const createYouvesStakeTransfersParams = async (
  earnOpportunity: SavingsItem,
  amount: BigNumber,
  tezos: TezosToolkit,
  accountPkh: string,
  stakeId?: string
) => {
  const { contractAddress: stakeAddress, stakedToken } = earnOpportunity;
  const { approve: approveAsset, revoke: revokeAsset } = await getTransferPermissions(
    tezos,
    stakeAddress,
    accountPkh,
    {
      standard:
        stakedToken.type === EarnOpportunityTokenStandardEnum.Fa2
          ? Route3TokenStandardEnum.fa2
          : Route3TokenStandardEnum.fa12,
      contract: stakedToken.contractAddress,
      tokenId: stakedToken.fa2TokenId?.toString() ?? '0'
    },
    amount
  );
  const stakeContract = await getReadOnlyContract(stakeAddress, tezos);
  const depositTransferParams = stakeContract.methods.deposit(new BigNumber(stakeId ?? 0), amount).toTransferParams();

  return [...approveAsset, depositTransferParams, ...revokeAsset];
};
