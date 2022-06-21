import { TezosOperationType } from '@airgap/beacon-sdk';
import { ParamsWithKind } from '@taquito/taquito';
import { of } from 'rxjs';

import { BeaconHandler } from '../beacon/beacon-handler';
import { SemiPartialTezosOperation } from '../types/semi-partial-tezos-operation';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapBeaconToTaquitoParams = (op: SemiPartialTezosOperation): ParamsWithKind => {
  const { fee, gas_limit, storage_limit, ...rest } = op;

  const walletParam = {
    ...rest,
    fee: fee as any,
    gasLimit: gas_limit as any,
    storageLimit: storage_limit as any
  };

  switch (walletParam.kind) {
    case TezosOperationType.ORIGINATION:
      const { script, ...orgRest } = walletParam;
      const { code, storage } = script as any; // Beacon has wrong types for script prop

      return {
        ...orgRest,
        kind: walletParam.kind as any, // Beacon and taquito has different enums for op.kind
        mutez: true, // The balance was already converted from Tez (ꜩ) to Mutez (uꜩ)
        init: storage,
        code
      };

    case TezosOperationType.TRANSACTION:
      const { destination, amount, parameters, ...txRest } = walletParam;

      return {
        ...txRest,
        kind: walletParam.kind as any, // Beacon and taquito has different enums for op.kind
        mutez: true, // The balance was already converted from Tez (ꜩ) to Mutez (uꜩ)
        amount: amount as any,
        to: destination,
        parameter: parameters
      };

    default:
      return walletParam as any; // Beacon and taquito has different enums for op.kind
  }
};

// pseudo async function as we don't need to wait until Beacon will remove all connections
// (common async solution does not work without the Internet connection)
export const resetBeacon$ = () => {
  Promise.all([BeaconHandler.removeAllPermissions(), BeaconHandler.removeAllPeers()]);

  return of(0);
};

const IS_BEACON_PAYLOAD_CHECK = /^tezos:\/\/[?]((type=.*&data=.*)|(data=.*&type=.*))/;

export const isBeaconPayload = (link: string) => IS_BEACON_PAYLOAD_CHECK.test(link);
