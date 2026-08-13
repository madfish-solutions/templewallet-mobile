import { PartialTezosOperation } from '@tezos-x/octez.connect-sdk';

export type SemiPartialTezosOperation = PartialTezosOperation & {
  fee?: string;
  gas_limit?: string;
  storage_limit?: string;
};
