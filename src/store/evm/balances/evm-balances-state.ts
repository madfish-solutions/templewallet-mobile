interface EvmChainBalancesEntry {
  balances: Record<string, string>;
  timestamp: number;
}

export type EvmBalancesRecord = Record<HexString, Record<number, EvmChainBalancesEntry>>;

export interface EvmBalancesState {
  record: EvmBalancesRecord;
}

export const evmBalancesInitialState: EvmBalancesState = {
  record: {}
};
