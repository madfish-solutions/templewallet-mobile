import { tzktApi } from 'src/api.service';
import { TzktCycle } from 'src/interfaces/tzkt/cycle.interface';
import { TzktProtocol } from 'src/interfaces/tzkt/protocol.interface';

import {
  allInt32ParameterKeys,
  GetOperationsBaseParams,
  OperationSortParams,
  TzktGetRewardsParams,
  TzktGetRewardsResponse,
  TzktSetDelegateParamsOperation
} from '../interfaces/tzkt';

export const getDelegatorRewards = ({ address, cycle = {}, sort, quote, ...restParams }: TzktGetRewardsParams) =>
  tzktApi
    .get<TzktGetRewardsResponse>(`/rewards/delegators/${address}`, {
      params: {
        ...allInt32ParameterKeys.reduce(
          (cycleParams, key) => ({
            ...cycleParams,
            [`cycle.${key}`]: cycle[key]
          }),
          {}
        ),
        ...(sort ? { [`sort.${sort}`]: 'cycle' } : {}),
        quote: quote?.join(','),
        ...restParams
      }
    })
    .then(x => x.data);

export const getCycles = (offset?: number, limit?: number) =>
  tzktApi.get<TzktCycle[]>('/cycles', { params: { offset, limit } }).then(x => x.data);

export const getProtocol = () => tzktApi.get<TzktProtocol>('/protocols/current').then(x => x.data);

export const getProtocolByCycle = (cycle: number) =>
  tzktApi.get<TzktProtocol>(`/protocols/cycles/${cycle}`).then(x => x.data);

export const fetchSetDelegateParametersOperations = (params: GetOperationsBaseParams & OperationSortParams) =>
  tzktApi.get<TzktSetDelegateParamsOperation[]>('/operations/set_delegate_parameters', { params }).then(x => x.data);
