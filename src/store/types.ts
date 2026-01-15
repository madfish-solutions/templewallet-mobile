import { Action, CombinedState } from '@reduxjs/toolkit';
import type { Reducer } from 'redux';
import { Epic } from 'redux-observable';

import type { rootReducer } from './root-state.reducers';

type GetStateType<R> = R extends Reducer<CombinedState<infer S>> ? S : never;

export type RootState = GetStateType<typeof rootReducer>;

export type AnyActionEpic = Epic<Action, Action, RootState>;

export interface LoadableEntityState<T, E = string> {
  data: T;
  error?: E;
  isLoading: boolean;
}
