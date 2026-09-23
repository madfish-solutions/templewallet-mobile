import { createReducer } from '@reduxjs/toolkit';
import { createMigrate, MigrationManifest, PersistedState, persistReducer } from 'redux-persist';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { SlicedAsyncStorage } from 'src/utils/sliced-async-storage';

import {
  processLoadedEvmAssetsAction,
  setEvmAssetManualAction,
  setEvmAssetVisibilityAction
} from './evm-assets-actions';
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

const evmAssetsReducers = createReducer<EvmAssetsState>(evmAssetsInitialState, builder => {
  builder.addCase(processLoadedEvmAssetsAction, (state, { payload }) => {
    const { account, chainId, assets } = payload;
    const chainAssetsRecord = getChainAssetsRecord(state, account, chainId);

    for (const slug in chainAssetsRecord) {
      if (!(slug in assets) && !chainAssetsRecord[slug].manual) {
        delete chainAssetsRecord[slug];
      }
    }

    for (const slug in assets) {
      const stored = chainAssetsRecord[slug];
      if (!stored) {
        chainAssetsRecord[slug] = {
          standard: assets[slug].standard,
          manual: false,
          visibility: VisibilityEnum.Visible
        };
      } else if (stored.standard !== assets[slug].standard) {
        stored.standard = assets[slug].standard;
      }
    }
  });

  builder.addCase(setEvmAssetManualAction, (state, { payload }) => {
    const { account, chainId, slug, manual, standard } = payload;
    const chainAssetsRecord = getChainAssetsRecord(state, account, chainId);
    const asset = chainAssetsRecord[slug];

    if (asset) {
      asset.manual = manual;
    } else if (manual) {
      chainAssetsRecord[slug] = {
        standard: standard ?? EvmAssetStandardEnum.ERC20,
        manual,
        visibility: VisibilityEnum.Visible
      };
    }
  });

  builder.addCase(setEvmAssetVisibilityAction, (state, { payload }) => {
    const asset = getChainAssetsRecord(state, payload.account, payload.chainId)[payload.slug];
    if (asset) {
      asset.visibility = payload.visibility;
    }
  });
});

const MIGRATIONS: MigrationManifest = {
  '1': (untypedState: PersistedState): PersistedState => {
    if (!untypedState) {
      return untypedState;
    }

    const state = untypedState as unknown as EvmAssetsState;
    for (const accountAssets of Object.values(state.record)) {
      for (const chainAssets of Object.values(accountAssets)) {
        for (const asset of Object.values(chainAssets)) {
          asset.visibility ??= VisibilityEnum.Visible;
        }
      }
    }

    return state as unknown as PersistedState;
  }
};

export const evmAssetsPersistedReducer = persistReducer(
  {
    key: 'root.evmAssets',
    version: 1,
    storage: SlicedAsyncStorage,
    migrate: createMigrate(MIGRATIONS, { debug: __DEV__ })
  },
  evmAssetsReducers
);
