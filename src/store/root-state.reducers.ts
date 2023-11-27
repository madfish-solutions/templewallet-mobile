import { combineReducers } from '@reduxjs/toolkit';
import type { CombinedState } from '@reduxjs/toolkit';
import { Action, AnyAction, ReducersMapObject } from 'redux';
import type { Reducer } from 'redux';
import { createTransform, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistConfig } from 'redux-persist/lib/types';
import { on, reducer } from 'ts-action';

import { persistFailHandler } from 'src/utils/redux';

import { resetApplicationAction } from './root-state.actions';
import { rootStateReducersMap } from './root-state.map';
import { SlicedAsyncStorage } from './sliced-async-storage';
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

const persistRootBlacklist: (keyof RootState)[] = ['buyWithCreditCard', 'exolix', 'farms', 'savings', 'collectibles'];

const PersistBlacklistTransform = createTransform(
  () => void 0,
  () => void 0,
  { whitelist: persistRootBlacklist }
);

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  storage: SlicedAsyncStorage,
  stateReconciler: autoMergeLevel2,
  writeFailHandler: persistFailHandler,
  /**
   * Basic(out-of-the-box) config setting `blacklist: persistRootBlacklist`
   * does not work as expected (presumably for `AsyncStorage` case).
   *
   * It does not respect new-added blacklisted slices for a while after app launch.
   * Results in misrepresented store state.
   */
  transforms: [PersistBlacklistTransform]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
