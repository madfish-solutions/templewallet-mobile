import { OpKind } from '@taquito/rpc';
import { ParamsWithKind, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Account } from '../interfaces/account.interfaces';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getTokenType } from '../token/utils/token.utils';

import { getAccountAddressForTezos, getAccountForTezos } from './account.utils';
import { isString } from './is-string';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';
import { throwError$ } from './rxjs.utils';

export function getTransferParams$(
  asset: Pick<TokenMetadataInterface, 'id' | 'address'>,
  tezosFromArgs: TezosToolkit | undefined,
  sender: Account | string,
  receiverPublicKeyHash: string,
  amount: BigNumber
): Observable<TransferParams> {
  const { id, address } = asset;
  const tezos =
    tezosFromArgs ?? createReadOnlyTezosToolkit(typeof sender === 'string' ? undefined : getAccountForTezos(sender));
  const senderPkh = typeof sender === 'string' ? sender : getAccountAddressForTezos(sender);

  if (!senderPkh) {
    return throwError$('Select a Tezos account to send this asset');
  }

  return isString(address)
    ? from(tezos.contract.at(address)).pipe(
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
                        { string: senderPkh },
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
            : contract.methodsObject
                .transfer({ from: senderPkh, to: receiverPublicKeyHash, value: amount })
                .toTransferParams()
        )
      )
    : of({
        amount: amount.toNumber(),
        to: receiverPublicKeyHash,
        mutez: true
      });
}

export const parseTransferParamsToParamsWithKind = (transferParams: TransferParams): ParamsWithKind[] => [
  { ...transferParams, kind: OpKind.TRANSACTION }
];
