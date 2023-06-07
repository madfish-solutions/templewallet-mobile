import { TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { Route3Token } from 'src/interfaces/route3.interface';

export const getTransferPermissions = async (
  tezos: TezosToolkit,
  spender: string,
  owner: string,
  tokenToSpend: Pick<Route3Token, 'contract' | 'standard' | 'tokenId'>,
  amountToSpendAtomic: BigNumber
) => {
  const permissions: { approve: Array<TransferParams>; revoke: Array<TransferParams> } = {
    approve: [],
    revoke: []
  };

  if (tokenToSpend.contract === null) {
    return permissions;
  }

  const assetContract = await tezos.wallet.at(tokenToSpend.contract);
  if (tokenToSpend.standard === Route3TokenStandardEnum.fa12) {
    const reset = assetContract.methods.approve(spender, 0).toTransferParams({ mutez: true });
    const spend = assetContract.methods.approve(spender, amountToSpendAtomic).toTransferParams({ mutez: true });
    permissions.approve.push(reset, spend);
  } else if (tokenToSpend.standard === Route3TokenStandardEnum.fa2) {
    const spend = assetContract.methods
      .update_operators([
        {
          add_operator: {
            owner,
            operator: spender,
            token_id: tokenToSpend.tokenId
          }
        }
      ])
      .toTransferParams({ mutez: true });
    const reset = assetContract.methods
      .update_operators([
        {
          remove_operator: {
            owner,
            operator: spender,
            token_id: tokenToSpend.tokenId
          }
        }
      ])
      .toTransferParams({ mutez: true });

    permissions.approve.push(spend);
    permissions.revoke.push(reset);
  }

  return permissions;
};
