// Deliberately parallels the TZKT queries in token-operations.util.ts - the old activity pipeline
// coexists with this file until TW-2302 deletes it
import { stringify } from 'qs';

import { tzktApi } from 'src/api.service';

import { TzktOperation, TzktOperationType } from './types';

const paramsSerializer = (params: Record<string, unknown>) => stringify(params);

async function fetchGet<R>(endpoint: string, params?: object, signal?: AbortSignal) {
  const { data } = await tzktApi.get<R>(endpoint, { params, paramsSerializer, signal });

  return data;
}

type TimestampParams = {
  [key in `timestamp.${'lt' | 'le' | 'ge'}`]?: string;
};

type LevelParams = {
  [key in `level.${'lt' | 'le' | 'ge'}`]?: number;
};

type SortParams = {
  [key in `sort${'' | '.desc'}`]?: 'id' | 'level';
};

type IdParams = {
  [key in `id.${'lt' | 'gt'}`]?: number;
};

type GetOperationsTransactionsParams = TimestampParams &
  LevelParams &
  IdParams &
  SortParams & {
    limit?: number;
    entrypoint?: 'transfer' | 'mintOrBurn';
  } & {
    [key in `target${'' | '.ne'}`]?: string;
  } & {
    [key in `sender${'' | '.ne'}`]?: string;
  } & {
    [key in `initiator${'' | '.ne'}`]?: string;
  } & {
    [key in `anyof.sender.target${'' | '.initiator'}`]?: string;
  } & {
    [key in `amount${'' | '.ne'}`]?: string;
  } & {
    [key in `parameter.${'to' | 'in' | '[*].in' | '[*].txs.[*].to_'}`]?: string;
  };

type GetAccountOperationsParams = TimestampParams & {
  limit?: number;
  types?: TzktOperationType[];
  sort?: 0 | 1;
  lastId?: number;
};

export const fetchGetOperationsTransactions = (params: GetOperationsTransactionsParams, signal?: AbortSignal) =>
  fetchGet<TzktOperation[]>('/operations/transactions', params, signal);

export const fetchGetAccountOperations = (
  accountAddress: string,
  params: GetAccountOperationsParams,
  signal?: AbortSignal
) => {
  const { types, ...restParams } = params;

  return fetchGet<TzktOperation[]>(
    '/accounts/activity',
    {
      ...restParams,
      addresses: accountAddress,
      ...(types ? { types: types.join(',') } : undefined)
    },
    signal
  );
};

export const fetchGetOperationsByHash = (hash: string, signal?: AbortSignal) =>
  fetchGet<TzktOperation[]>(`/operations/${hash}`, undefined, signal);
