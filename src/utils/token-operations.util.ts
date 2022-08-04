import { tzktApi } from '../api.service';
import { OPERATION_LIMIT } from '../config/general';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { OperationFa12Interface, OperationFa2Interface, OperationInterface } from '../interfaces/operation.interface';
import { isDefined } from './is-defined';

export const getOperationGroupByHash = <T>(hash: string) => tzktApi.get<Array<T>>(`operations/${hash}`);

export const getContractOperations = <T>(account: string, contractAddress: string, lastLevel: number | null) =>
  tzktApi.get<Array<T>>(`accounts/${contractAddress}/operations`, {
    params: {
      type: 'transaction',
      limit: OPERATION_LIMIT,
      sort: '1',
      initiator: account,
      entrypoint: 'mintOrBurn',
      ...(isDefined(lastLevel) ? { 'level.lt': lastLevel } : undefined)
    }
  });

export const getTokenFa2Operations = async (
  account: string,
  contractAddress: string,
  tokenId = '0',
  lastLevel: number | null
) =>
  (
    await tzktApi.get<Array<OperationFa2Interface>>('operations/transactions', {
      params: {
        limit: OPERATION_LIMIT,
        entrypoint: 'transfer',
        'sort.desc': 'level',
        target: contractAddress,
        'parameter.[*].in': `[{"from_":"${account}","txs":[{"token_id":"${tokenId}"}]},{"txs":[{"to_":"${account}","token_id":"${tokenId}"}]}]`,
        ...(isDefined(lastLevel) ? { 'level.lt': lastLevel } : undefined)
      }
    })
  ).data;

export const getTokenFa12Operations = async (account: string, contractAddress: string, lastLevel: number | null) =>
  (
    await tzktApi.get<Array<OperationFa12Interface>>('operations/transactions', {
      params: {
        limit: OPERATION_LIMIT,
        entrypoint: 'transfer',
        'sort.desc': 'level',
        target: contractAddress,
        'parameter.in': `[{"from":"${account}"},{"to":"${account}"}]`,
        ...(isDefined(lastLevel) ? { 'level.lt': lastLevel } : undefined)
      }
    })
  ).data;

export const getTezosOperations = async (account: string, lastLevel: number | null) =>
  (
    await tzktApi.get<Array<OperationInterface>>(`accounts/${account}/operations`, {
      params: {
        limit: OPERATION_LIMIT,
        type: ActivityTypeEnum.Transaction,
        sort: '1',
        'parameter.null': true,
        ...(isDefined(lastLevel) ? { lastId: lastLevel } : undefined)
      }
    })
  ).data;

export const getTokenOperations = async (account: string, lastId: number | null) =>
  (
    await tzktApi.get<Array<OperationInterface>>(`accounts/${account}/operations`, {
      params: {
        limit: OPERATION_LIMIT,
        type: `${ActivityTypeEnum.Delegation},${ActivityTypeEnum.Origination},${ActivityTypeEnum.Transaction}`,
        sort: '1',
        ...(isDefined(lastId) ? { lastId } : undefined)
      }
    })
  ).data;

export const getFa12IncomingOperations = async (account: string, lowerId: number, upperId: number | null) =>
  (
    await tzktApi.get<Array<OperationFa12Interface>>('operations/transactions', {
      params: {
        'sender.ne': account,
        'target.ne': account,
        'initiator.ne': account,
        'id.gt': lowerId,
        entrypoint: 'transfer',
        'parameter.to': account,
        ...(isDefined(upperId) ? { 'id.lt': upperId } : undefined)
      }
    })
  ).data;

export const getFa2IncomingOperations = async (account: string, lowerId: number, upperId: number | null) =>
  (
    await tzktApi.get<Array<OperationFa2Interface>>('operations/transactions', {
      params: {
        'sender.ne': account,
        'target.ne': account,
        'initiator.ne': account,
        'id.gt': lowerId,
        entrypoint: 'transfer',
        'parameter.[*].txs.[*].to_': account,
        ...(isDefined(upperId) ? { 'id.lt': upperId } : undefined)
      }
    })
  ).data;
