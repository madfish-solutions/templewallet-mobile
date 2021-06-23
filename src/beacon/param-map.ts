import { PartialTezosOperation, TezosOperationType } from '@airgap/beacon-sdk';
import { WalletParamsWithKind } from '@taquito/taquito';

export type SemiPartialTezosOperation = PartialTezosOperation & {
  fee?: string;
  gas_limit?: string;
  storage_limit?: string;
};

export function toWalletParam(op: SemiPartialTezosOperation): WalletParamsWithKind {
  const { fee, gas_limit, storage_limit, ...rest } = op;

  const walletParam = {
    ...rest,
    fee,
    gasLimit: gas_limit,
    storageLimit: storage_limit
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
}
