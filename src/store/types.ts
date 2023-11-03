import { CombinedState } from '@reduxjs/toolkit';
import type { Reducer } from 'redux';

import type { rootReducer } from './root-state.reducers';

type GetStateType<R> = R extends Reducer<CombinedState<infer S>> ? S : never;

export type RootState = GetStateType<typeof rootReducer>;

export interface LoadableEntityState<T> {
  data: T;
  error?: string;
  isLoading: boolean;
}
