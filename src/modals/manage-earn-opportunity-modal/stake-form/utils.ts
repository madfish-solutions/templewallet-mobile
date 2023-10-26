import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { EarnOpportunityTokenStandardEnum } from 'src/enums/earn-opportunity-token-standard.enum';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { getTransferPermissions } from 'src/utils/transfer-permissions.util';

export const prepareToTransferParams = async (
  earnOpportunity: SavingsItem,
  amount: BigNumber,
  tezos: TezosToolkit,
  accountPkh: string
) => {
  const { contractAddress: stakeAddress, stakedToken } = earnOpportunity;

  const partialThreeRouteStakedToken = {
    standard:
      stakedToken.type === EarnOpportunityTokenStandardEnum.Fa2
        ? Route3TokenStandardEnum.fa2
        : Route3TokenStandardEnum.fa12,
    contract: stakedToken.contractAddress,
    tokenId: stakedToken.fa2TokenId?.toString() ?? '0'
  };

  const stakeContract = await getReadOnlyContract(stakeAddress, tezos);

  const { approve, revoke } = await getTransferPermissions(
    tezos,
    stakeAddress,
    accountPkh,
    partialThreeRouteStakedToken,
    amount
  );

  return {
    stakeContract,
    methods: {
      approve,
      revoke
    }
  };
};
