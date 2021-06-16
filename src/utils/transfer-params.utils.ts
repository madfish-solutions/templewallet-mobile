import { TezosToolkit } from '@taquito/taquito';
import { TransferParams } from '@taquito/taquito/dist/types/operations/types';
import { BigNumber } from 'bignumber.js';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { WalletAccountInterface } from '../interfaces/wallet-account.interface';
import { AssetMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getTokenType } from '../token/utils/token.utils';
import { isDefined } from './is-defined';
import { tzToMutez } from './tezos.util';

export const getTransferParams$ = (
  asset: AssetMetadataInterface,
  sender: WalletAccountInterface,
  receiverPublicKeyHash: string,
  amount: BigNumber,
  tezos: TezosToolkit
): Observable<TransferParams> => {
  const { id, address, decimals } = asset;

  return isDefined(address)
    ? from(tezos.contract.at(address)).pipe(
        map(contract =>
          getTokenType(contract) === TokenTypeEnum.FA_2
            ? contract.methods.transfer([
                {
                  from_: sender.publicKeyHash,
                  txs: [
                    {
                      to_: receiverPublicKeyHash,
                      token_id: id,
                      amount: tzToMutez(amount, decimals).toFixed()
                    }
                  ]
                }
              ])
            : contract.methods.transfer(
                sender.publicKeyHash,
                receiverPublicKeyHash,
                tzToMutez(amount, decimals).toFixed()
              )
        ),
        map(contractMethod => contractMethod.toTransferParams())
      )
    : of({
        amount: tzToMutez(amount, decimals).toNumber(),
        to: receiverPublicKeyHash,
        mutez: true
      });
};
