import { PartialTezosOperation } from '@airgap/beacon-sdk';

export type SemiPartialTezosOperation = PartialTezosOperation & {
  fee?: string;
  gas_limit?: string;
  storage_limit?: string;
};
