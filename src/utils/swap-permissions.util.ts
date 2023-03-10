import { TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';

export const getTransferPermissions = async (
  tezos: TezosToolkit,
  spender: string,
  owner: string,
  tokenToSpend: TokenInterface,
  amount: BigNumber
) => {
  const permissions: { approve: Array<TransferParams>; revoke: Array<TransferParams> } = {
    approve: [],
    revoke: []
  };

  if (tokenToSpend.symbol === 'TEZ') {
    return permissions;
  }

  const assetContract = await tezos.wallet.at(tokenToSpend.address);
  if (tokenToSpend.standard === TokenStandardsEnum.Fa12) {
    const reset = assetContract.methods.approve(spender, 0).toTransferParams({ mutez: true });
    const spend = assetContract.methods
      .approve(spender, amount.multipliedBy(10 ** tokenToSpend.decimals))
      .toTransferParams({ mutez: true });
    permissions.approve.push(reset);
    permissions.approve.push(spend);
  } else if (tokenToSpend.standard === TokenStandardsEnum.Fa2) {
    const spend = assetContract.methods
      .update_operators([
        {
          add_operator: {
            owner,
            operator: spender,
            token_id: tokenToSpend.id
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
            token_id: tokenToSpend.id
          }
        }
      ])
      .toTransferParams({ mutez: true });

    permissions.approve.push(spend);
    permissions.revoke.push(reset);
  }

  return permissions;
};
