import { Action, createAction, ThunkAction } from '@reduxjs/toolkit';

import type { RootState } from 'src/store/types';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { equalsIgnoreCase } from 'src/utils/evm/on-chain/common.utils';

type AppThunk = ThunkAction<void, RootState, unknown, Action>;

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

interface ProcessLoadedOnChainEvmBalancesActionPayload {
  account: HexString;
  chainId: number;
  balances: Record<string, string>;
  timestamp: number;
}

export const processLoadedOnChainEvmBalancesAction = createAction<ProcessLoadedOnChainEvmBalancesActionPayload>(
  'evm/balances/PROCESS_LOADED_ON_CHAIN_EVM_BALANCES'
);

/** An in-flight load can finish after the address was removed, for example by a wallet reset. */
const isExistingEvmAccount = (state: RootState, account: HexString) =>
  state.wallet.accounts.some(walletAccount => equalsIgnoreCase(getAccountAddressForEvm(walletAccount), account));

const withExistingEvmAccount =
  <P extends { account: HexString }>(actionCreator: (payload: P) => Action) =>
  (payload: P): AppThunk =>
  (dispatch, getState) => {
    if (isExistingEvmAccount(getState(), payload.account)) {
      dispatch(actionCreator(payload));
    }
  };

export const processLoadedEvmBalances = withExistingEvmAccount(processLoadedEvmBalancesAction);

export const processLoadedOnChainEvmBalances = withExistingEvmAccount(processLoadedOnChainEvmBalancesAction);
