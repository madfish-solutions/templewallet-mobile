import { TezosToolkit } from '@taquito/taquito';
import { TransferParams } from '@taquito/taquito/dist/types/operations/types';
import { BigNumber } from 'bignumber.js';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { WalletAccountInterface } from '../interfaces/wallet-account.interface';
import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getTokenType } from '../token/utils/token.utils';
import { isString } from './is-string';
import { tzToMutez } from './tezos.util';

export const getTezosTransferParams = (receiverPublicKeyHash: string, amount: BigNumber) => ({
  amount: tzToMutez(amount, TEZ_TOKEN_METADATA.decimals).toNumber(),
  to: receiverPublicKeyHash,
  mutez: true
});

export const getTransferParams$ = (
  token: TokenMetadataInterface,
  sender: WalletAccountInterface,
  receiverPublicKeyHash: string,
  amount: BigNumber,
  tezos: TezosToolkit
): Observable<TransferParams> => {
  const { id, address, decimals } = token;

  return isString(address)
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
    : of(getTezosTransferParams(receiverPublicKeyHash, amount));
};
