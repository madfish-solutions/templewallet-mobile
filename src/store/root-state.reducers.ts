import { combineReducers } from '@reduxjs/toolkit';
import { Action, AnyAction, CombinedState, Reducer, ReducersMapObject } from 'redux';
import { on, reducer } from 'ts-action';

import { resetApplicationAction } from './root-state.actions';

export const rootStateReducer =
  <S, A extends Action = AnyAction>(reducers: ReducersMapObject<S, A>): Reducer<CombinedState<S>, A> =>
  (appState, action) => {
    const rootReducer = reducer(
      appState,
      on(resetApplicationAction.success, _ => undefined)
    );

    const state = rootReducer(appState, action);

    return combineReducers(reducers)(state, action);
  };
