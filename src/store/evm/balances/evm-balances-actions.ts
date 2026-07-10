import { createAction } from '@reduxjs/toolkit';

interface ProcessLoadedEvmBalancesActionPayload {
  account: HexString;
  chainId: number;
  balances: Record<string, string>;
  timestamp: number;
  preservedSlugs?: string[];
}

export const processLoadedEvmBalancesAction = createAction<ProcessLoadedEvmBalancesActionPayload>(
  'evm/balances/PROCESS_LOADED_EVM_BALANCES'
);
