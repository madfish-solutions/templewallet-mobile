import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { TokenInterface } from 'src/token/interfaces/token.interface';

import { ROUTING_FEE_ADDRESS } from './config';

export const getRoutingFeeTransferParams = async (
  outputAsset: TokenInterface,
  feeAmountAtomic: BigNumber,
  senderPublicKeyHash: string,
  tezos: TezosToolkit
) => {
  if (outputAsset.symbol === 'TEZ') {
    return [
      {
        amount: feeAmountAtomic.toNumber(),
        to: ROUTING_FEE_ADDRESS,
        mutez: true
      }
    ];
  }

  const assetContract = await tezos.wallet.at(outputAsset.address);

  if (outputAsset.standard === 'fa12') {
    return [
      assetContract.methods
        .transfer(senderPublicKeyHash, ROUTING_FEE_ADDRESS, feeAmountAtomic)
        .toTransferParams({ mutez: true })
    ];
  }
  if (outputAsset.standard === 'fa2') {
    return [
      assetContract.methods
        .transfer([
          {
            from_: senderPublicKeyHash,
            txs: [
              {
                to_: ROUTING_FEE_ADDRESS,
                token_id: outputAsset.id,
                amount: feeAmountAtomic
              }
            ]
          }
        ])
        .toTransferParams({ mutez: true })
    ];
  }

  return [];
};
