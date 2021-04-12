import { Reducer, ReducersMapObject } from 'redux';
import { on, reducer } from 'ts-action';

import { rootStateResetAction } from './root-state.actions';
import { combineReducers } from '@reduxjs/toolkit';

export const rootStateReducer = <S>(reducers: ReducersMapObject<S, any>): Reducer<S> => (appState, action) => {
  const rootReducer = reducer(
    appState,
    on(rootStateResetAction, _ => undefined)
  );

  const state = rootReducer(appState, action);

  return combineReducers(reducers)(state, action);
};
