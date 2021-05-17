import { combineReducers } from '@reduxjs/toolkit';
import { Action, AnyAction, Reducer, ReducersMapObject } from 'redux';
import { on, reducer } from 'ts-action';

import { rootStateResetAction } from './root-state.actions';

export const rootStateReducer =
  <S, A extends Action = AnyAction>(reducers: ReducersMapObject<S, A>): Reducer<S, A> =>
  (appState, action) => {
    const rootReducer = reducer(
      appState,
      on(rootStateResetAction, _ => undefined)
    );

    const state = rootReducer(appState, action);

    return combineReducers(reducers)(state, action);
  };
