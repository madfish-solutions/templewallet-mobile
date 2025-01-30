import { combineReducers } from '@reduxjs/toolkit';
import type { CombinedState } from '@reduxjs/toolkit';
import { Action, AnyAction, ReducersMapObject } from 'redux';
import type { Reducer } from 'redux';
import { createMigrate, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistConfig } from 'redux-persist/lib/types';
import { on, reducer } from 'ts-action';

import { persistFailHandler } from 'src/utils/redux';
import { SlicedAsyncStorage } from 'src/utils/sliced-async-storage';

import { MIGRATIONS } from './migrations';
import { resetApplicationAction } from './root-state.actions';
import { rootStateReducersMap } from './root-state.map';
import type { RootState } from './types';

const buildRootStateReducer = <S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
): Reducer<CombinedState<S>, A> => {
  const combinedReducers = combineReducers(reducers);

  return (appState, action) => {
    const rootReducer = reducer(
      appState,
      on(resetApplicationAction.success, _ => undefined)
    );

    const state = rootReducer(appState, action);

    return combinedReducers(state, action);
  };
};

export const rootReducer = buildRootStateReducer(rootStateReducersMap);

const persistConfigBlacklist: (keyof RootState)[] = [
  'buyWithCreditCard',
  'exolix',
  'farms',
  'savings',
  'collectibles',
  'tokensMetadata'
];

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 7,
  storage: SlicedAsyncStorage,
  stateReconciler: autoMergeLevel2,
  writeFailHandler: persistFailHandler,
  migrate: createMigrate(MIGRATIONS, { debug: __DEV__ }),
  /**
   * (!) With async storage, rehydration is done after initial state is set.
   * And new-added blacklisted slices might not be applied correctly.
   * Be careful with store architecture changes - migration might be needed.
   */
  blacklist: persistConfigBlacklist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
