import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import type { CombinedState } from '@reduxjs/toolkit';
import { Action, AnyAction, ReducersMapObject } from 'redux';
import type { Reducer } from 'redux';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistConfig } from 'redux-persist/lib/types';
import { on, reducer } from 'ts-action';

import { resetApplicationAction } from './root-state.actions';
import { rootStateReducersMap } from './root-state.map';
import type { RootState } from './types';

const buildRootStateReducer =
  <S, A extends Action = AnyAction>(reducers: ReducersMapObject<S, A>): Reducer<CombinedState<S>, A> =>
  (appState, action) => {
    const rootReducer = reducer(
      appState,
      on(resetApplicationAction.success, _ => undefined)
    );

    const state = rootReducer(appState, action);

    return combineReducers(reducers)(state, action);
  };

const rootReducer = buildRootStateReducer(rootStateReducersMap);

const persistConfigBlacklist: (keyof RootState)[] = ['buyWithCreditCard', 'exolix'];

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  blacklist: persistConfigBlacklist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
