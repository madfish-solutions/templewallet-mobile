import { TransferParams } from '@taquito/taquito/dist/types/operations/types';
import { BigNumber } from 'bignumber.js';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { WalletAccountInterface } from '../interfaces/wallet-account.interface';
import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getTokenType } from '../token/utils/token.utils';
import { isString } from './is-string';
import { createReadOnlyTezosToolkit } from './network/tezos-toolkit.utils';
import { tzToMutez } from './tezos.util';

export const getTransferParams$ = (
  token: TokenMetadataInterface,
  sender: WalletAccountInterface,
  receiverPublicKeyHash: string,
  amount: BigNumber
): Observable<TransferParams> => {
  const { id, address, decimals } = token;

  return isString(address)
    ? from(createReadOnlyTezosToolkit(sender).contract.at(address)).pipe(
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
