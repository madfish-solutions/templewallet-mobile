import { getTzktApi } from 'src/api.service';
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

export const getDelegatorRewards = (
  selectedRpcUrl: string,
  { address, cycle = {}, sort, quote, ...restParams }: TzktGetRewardsParams
) =>
  getTzktApi(selectedRpcUrl)
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

export const getCycles = (selectedRpcUrl: string, offset?: number, limit?: number) =>
  getTzktApi(selectedRpcUrl)
    .get<TzktCycle[]>('/cycles', { params: { offset, limit } })
    .then(x => x.data);

export const getProtocol = (selectedRpcUrl: string) =>
  getTzktApi(selectedRpcUrl)
    .get<TzktProtocol>('/protocols/current')
    .then(x => x.data);

export const getProtocolByCycle = (selectedRpcUrl: string, cycle: number) =>
  getTzktApi(selectedRpcUrl)
    .get<TzktProtocol>(`/protocols/cycles/${cycle}`)
    .then(x => x.data);

export const fetchSetDelegateParametersOperations = (
  selectedRpcUrl: string,
  params: GetOperationsBaseParams & OperationSortParams
) =>
  getTzktApi(selectedRpcUrl)
    .get<TzktSetDelegateParamsOperation[]>('/operations/set_delegate_parameters', { params })
    .then(x => x.data);
