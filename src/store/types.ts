import type { ReducerWithInitialState } from '@reduxjs/toolkit/dist/createReducer';

import type { rootStateReducersMap } from './root-state.map';

type RootStateReducersMapType = typeof rootStateReducersMap;

export type RootState = {
  [K in keyof RootStateReducersMapType]: RootStateReducersMapType[K] extends ReducerWithInitialState<infer S>
    ? S
    : never;
};

export interface LoadableEntityState<T> {
  data: T;
  error?: string;
  isLoading: boolean;
}
