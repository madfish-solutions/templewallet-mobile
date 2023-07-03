import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { TransferParams } from '@taquito/taquito/dist/types/operations/types';
import { BigNumber } from 'bignumber.js';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountInterface } from '../interfaces/account.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getTokenType } from '../token/utils/token.utils';
import { isString } from './is-string';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';

export const getTransferParams$ = (
  asset: TokenMetadataInterface,
  rpcUrl: string,
  sender: AccountInterface,
  receiverPublicKeyHash: string,
  amount: BigNumber
): Observable<TransferParams> => {
  const { id, address } = asset;

  return isString(address)
    ? from(createReadOnlyTezosToolkit(rpcUrl, sender).contract.at(address)).pipe(
        map(contract =>
          getTokenType(contract) === TokenTypeEnum.FA_2
            ? {
                to: contract.address,
                amount: 0,
                parameter: {
                  entrypoint: 'transfer',
                  value: [
                    {
                      prim: 'Pair',
                      args: [
                        { string: sender.publicKeyHash },
                        [
                          {
                            prim: 'Pair',
                            args: [
                              { string: receiverPublicKeyHash },
                              {
                                prim: 'Pair',
                                args: [{ int: new BigNumber(id).toFixed() }, { int: amount.toFixed() }]
                              }
                            ]
                          }
                        ]
                      ]
                    }
                  ]
                }
              }
            : contract.methods.transfer(sender.publicKeyHash, receiverPublicKeyHash, amount).toTransferParams()
        )
      )
    : of({
        amount: amount.toNumber(),
        to: receiverPublicKeyHash,
        mutez: true
      });
};

export const parseTransferParamsToParamsWithKind = (transferParams: TransferParams): ParamsWithKind[] => [
  { ...transferParams, kind: OpKind.TRANSACTION }
];
