import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';

import { ETHERLINK_BRIDGE_HELPER_ADDRESS, ETHERLINK_ROLLUP_ADDRESS } from 'src/config/etherlink-bridge';

export const buildBridgeDepositOpParams = (amountMutez: string, evmAddress: HexString): ParamsWithKind[] => [
  {
    kind: OpKind.TRANSACTION,
    to: ETHERLINK_BRIDGE_HELPER_ADDRESS,
    amount: Number(amountMutez),
    mutez: true,
    parameter: {
      entrypoint: 'deposit',
      value: {
        prim: 'Pair',
        args: [{ string: ETHERLINK_ROLLUP_ADDRESS }, { bytes: evmAddress.slice(2).toLowerCase() }]
      }
    }
  }
];
