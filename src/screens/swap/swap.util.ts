import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { Route3Token } from 'src/interfaces/route3.interface';

import { ROUTING_FEE_ADDRESS } from './config';

export const getRoutingFeeTransferParams = async (
  outputAsset: Route3Token,
  feeAmountAtomic: BigNumber,
  senderPublicKeyHash: string,
  tezos: TezosToolkit
) => {
  if (outputAsset.contract === null) {
    return [
      {
        amount: feeAmountAtomic.toNumber(),
        to: ROUTING_FEE_ADDRESS,
        mutez: true
      }
    ];
  }

  const assetContract = await tezos.wallet.at(outputAsset.contract);

  if (outputAsset.standard === Route3TokenStandardEnum.fa12) {
    return [
      assetContract.methods
        .transfer(senderPublicKeyHash, ROUTING_FEE_ADDRESS, feeAmountAtomic)
        .toTransferParams({ mutez: true })
    ];
  }

  if (outputAsset.standard === Route3TokenStandardEnum.fa2) {
    return [
      assetContract.methods
        .transfer([
          {
            from_: senderPublicKeyHash,
            txs: [
              {
                to_: ROUTING_FEE_ADDRESS,
                token_id: outputAsset.tokenId,
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
