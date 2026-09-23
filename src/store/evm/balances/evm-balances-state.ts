export type EvmChainBalancesRecord = Record<string, string>;

export type EvmBalancesRecord = Record<HexString, Record<number, EvmChainBalancesRecord>>;

export interface EvmBalancesState {
  record: EvmBalancesRecord;
  timestamps: Record<HexString, Record<number, number>>;
}

export const evmBalancesInitialState: EvmBalancesState = {
  record: {},
  timestamps: {}
};
