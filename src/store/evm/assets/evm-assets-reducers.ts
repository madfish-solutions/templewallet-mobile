import { createReducer } from '@reduxjs/toolkit';

import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';

import { processLoadedEvmAssetsAction, setEvmAssetManualAction } from './evm-assets-actions';
import { EvmChainAssetsRecord, evmAssetsInitialState, EvmAssetsState } from './evm-assets-state';

const getChainAssetsRecord = (state: EvmAssetsState, account: HexString, chainId: number): EvmChainAssetsRecord => {
  if (!state.record[account]) {
    state.record[account] = {};
  }
  if (!state.record[account][chainId]) {
    state.record[account][chainId] = {};
  }

  return state.record[account][chainId];
};

export const evmAssetsReducers = createReducer<EvmAssetsState>(evmAssetsInitialState, builder => {
  builder.addCase(processLoadedEvmAssetsAction, (state, { payload }) => {
    const { account, chainId, assets } = payload;
    const chainAssetsRecord = getChainAssetsRecord(state, account, chainId);

    const manualEntries = Object.entries(chainAssetsRecord).filter(([, asset]) => asset.manual);

    const newChainAssetsRecord: EvmChainAssetsRecord = {};
    for (const slug in assets) {
      newChainAssetsRecord[slug] = { standard: assets[slug].standard, manual: false };
    }
    for (const [slug, asset] of manualEntries) {
      newChainAssetsRecord[slug] = asset;
    }

    state.record[account][chainId] = newChainAssetsRecord;
  });

  builder.addCase(setEvmAssetManualAction, (state, { payload }) => {
    const { account, chainId, slug, manual, standard } = payload;
    const chainAssetsRecord = getChainAssetsRecord(state, account, chainId);
    const asset = chainAssetsRecord[slug];

    if (asset) {
      asset.manual = manual;
    } else if (manual) {
      chainAssetsRecord[slug] = { standard: standard ?? EvmAssetStandardEnum.ERC20, manual };
    }
  });
});
