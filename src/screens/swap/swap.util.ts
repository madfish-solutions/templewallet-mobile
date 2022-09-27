import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { getTradeOutputOperation, loadAssetContract, TokenStandardEnum, Trade } from 'swap-router-sdk';

import { isDefined } from '../../utils/is-defined';
import { ROUTING_FEE_ADDRESS } from './config';

export const getRoutingFeeTransferParams = async (
  trade: Trade,
  feeAmount: BigNumber,
  senderPublicKeyHash: string,
  tezos: TezosToolkit
) => {
  const tradeOutputOperation = getTradeOutputOperation(trade);

  if (isDefined(tradeOutputOperation)) {
    if (tradeOutputOperation.bTokenSlug === 'tez') {
      return [
        {
          amount: feeAmount.toNumber(),
          to: ROUTING_FEE_ADDRESS,
          mutez: true
        }
      ];
    }

    const assetContract = await loadAssetContract(tradeOutputOperation.bTokenSlug, tezos);

    if (isDefined(assetContract)) {
      if (assetContract.standard === TokenStandardEnum.FA1_2) {
        return [
          assetContract.contract.methods
            .transfer(senderPublicKeyHash, ROUTING_FEE_ADDRESS, feeAmount)
            .toTransferParams({ mutez: true })
        ];
      }
      if (assetContract.standard === TokenStandardEnum.FA2) {
        return [
          assetContract.contract.methods
            .transfer([
              {
                from_: senderPublicKeyHash,
                txs: [
                  {
                    to_: ROUTING_FEE_ADDRESS,
                    token_id: assetContract.assetId,
                    amount: feeAmount
                  }
                ]
              }
            ])
            .toTransferParams({ mutez: true })
        ];
      }
    }
  }

  return [];
};
