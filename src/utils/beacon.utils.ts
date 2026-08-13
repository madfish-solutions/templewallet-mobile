import { ParamsWithKind } from '@taquito/taquito';
import { TezosOperationType } from '@tezos-x/octez.connect-sdk';
import { of } from 'rxjs';

import { BeaconHandler } from 'src/beacon/beacon-handler';
import { SemiPartialTezosOperation } from 'src/types/semi-partial-tezos-operation';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapBeaconToTaquitoParams = (op: SemiPartialTezosOperation): ParamsWithKind => {
  const { fee, gas_limit, storage_limit, ...rest } = op;

  const walletParam = {
    ...rest,
    fee: stringToNumber(fee),
    gasLimit: stringToNumber(gas_limit),
    storageLimit: stringToNumber(storage_limit)
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
        amount: Number(amount),
        to: destination,
        parameter: parameters
      };

    default:
      return walletParam as any; // Beacon and taquito has different enums for op.kind
  }
};

const stringToNumber = (str?: string) => (Boolean(str) ? Number(str) : undefined);

// pseudo async function as we don't need to wait until Beacon will remove all connections
// (common async solution does not work without the Internet connection)
export const resetBeacon$ = () => {
  Promise.all([BeaconHandler.removeAllPermissions(), BeaconHandler.removeAllPeers()]);

  return of(0);
};

const IS_BEACON_PAYLOAD_CHECK = /^tezos:\/\/[?]((type=.*&data=.*)|(data=.*&type=.*))/;
const WALLETCONNECT_PAIRING_TYPE = 'walletconnect-pairing-request';

export const WALLETCONNECT_NOT_SUPPORTED_MESSAGE = 'WalletConnect is not supported';

export const isBeaconPayload = (link: string) => IS_BEACON_PAYLOAD_CHECK.test(link);

export const isWalletConnectPayload = (link: string) => link.startsWith('wc:');

export const isWalletConnectPairing = (obj: unknown): boolean => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const type = 'type' in obj ? obj.type : undefined;
  const uri = 'uri' in obj ? obj.uri : undefined;

  return type === WALLETCONNECT_PAIRING_TYPE || (typeof uri === 'string' && isWalletConnectPayload(uri));
};
