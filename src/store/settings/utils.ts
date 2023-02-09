import { Draft } from '@reduxjs/toolkit';

import { RpcInterface } from 'src/interfaces/rpc.interface';
import { TEMPLE_RPC } from 'src/utils/rpc/rpc-list';

import { SettingsState } from './settings-state';

export const alterCustomRPC = (state: Draft<SettingsState>, url: string, values?: RpcInterface) => {
  if (url === TEMPLE_RPC.url) {
    return;
  }

  const list = state.rpcList;
  const index = list.findIndex(rpc => rpc.url === url);

  if (index < 0) {
    return;
  }

  if (values == null) {
    // 'remove' case
    list.splice(index, 1);
    if (state.selectedRpcUrl === url) {
      state.selectedRpcUrl = state.rpcList[0].url;
    }
  } else {
    // 'edit' case
    list.splice(index, 1, values);
    if (url === state.selectedRpcUrl) {
      state.selectedRpcUrl = values.url;
    }
  }
};
