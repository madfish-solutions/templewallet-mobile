import { OpKind } from '@taquito/rpc';
import { ParamsWithKind, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountInterface } from '../interfaces/account.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getTokenType } from '../token/utils/token.utils';

import { isString } from './is-string';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';

export function getTransferParams$(
  asset: Pick<TokenMetadataInterface, 'id' | 'address'>,
  tezos: TezosToolkit,
  senderPkh: string,
  receiverPublicKeyHash: string,
  amount: BigNumber
): Observable<TransferParams>;
export function getTransferParams$(
  asset: Pick<TokenMetadataInterface, 'id' | 'address'>,
  rpcUrl: string,
  sender: AccountInterface,
  receiverPublicKeyHash: string,
  amount: BigNumber
): Observable<TransferParams>;
export function getTransferParams$(
  asset: Pick<TokenMetadataInterface, 'id' | 'address'>,
  rpcUrlOrTezos: string | TezosToolkit,
  sender: AccountInterface | string,
  receiverPublicKeyHash: string,
  amount: BigNumber
): Observable<TransferParams> {
  const { id, address } = asset;
  const tezos =
    typeof rpcUrlOrTezos === 'string'
      ? createReadOnlyTezosToolkit(rpcUrlOrTezos, sender as AccountInterface)
      : rpcUrlOrTezos;
  const senderPkh = typeof sender === 'string' ? sender : sender.publicKeyHash;

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
            : contract.methods.transfer(senderPkh, receiverPublicKeyHash, amount).toTransferParams()
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
