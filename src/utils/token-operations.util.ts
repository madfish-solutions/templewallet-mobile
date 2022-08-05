import { getTzktApi } from '../api.service';
import { OPERATION_LIMIT } from '../config/general';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { OperationFa12Interface, OperationFa2Interface, OperationInterface } from '../interfaces/operation.interface';
import { isDefined } from './is-defined';

export const getTokenFa2Operations = async (
  selectedRpcUrl: string,
  account: string,
  contractAddress: string,
  tokenId = '0',
  lastLevel: number | null
) =>
  (
    await getTzktApi(selectedRpcUrl).get<Array<OperationFa2Interface>>(
      `operations/transactions?limit=${OPERATION_LIMIT}&entrypoint=transfer&parameter.[*].in=[{"from_":"${account}","txs":[{"token_id":"${tokenId}"}]},{"txs":[{"to_":"${account}","token_id":"${tokenId}"}]}]&sort.desc=level&target=${contractAddress}` +
        (isDefined(lastLevel) ? `&level.lt=${lastLevel}` : '')
    )
  ).data;

export const getTokenFa12Operations = async (
  selectedRpcUrl: string,
  account: string,
  contractAddress: string,
  lastLevel: number | null
) =>
  (
    await getTzktApi(selectedRpcUrl).get<Array<OperationFa12Interface>>(
      `operations/transactions?limit=${OPERATION_LIMIT}&entrypoint=transfer&parameter.in=[{"from":"${account}"},{"to":"${account}"}]&sort.desc=level&target=${contractAddress}` +
        (isDefined(lastLevel) ? `&level.lt=${lastLevel}` : '')
    )
  ).data;

export const getTezosOperations = async (selectedRpcUrl: string, account: string, lastLevel: number | null) =>
  (
    await getTzktApi(selectedRpcUrl).get<Array<OperationInterface>>(
      `accounts/${account}/operations?limit=${OPERATION_LIMIT}&type=${ActivityTypeEnum.Transaction}&sort=1&parameter.null` +
        (isDefined(lastLevel) ? `&lastId=${lastLevel}` : '')
    )
  ).data;

export const getTokenOperations = async (selectedRpcUrl: string, account: string, lastId: number | null) =>
  (
    await getTzktApi(selectedRpcUrl).get<Array<OperationInterface>>(
      `accounts/${account}/operations?limit=${OPERATION_LIMIT}&sort=1&type=${ActivityTypeEnum.Delegation},${ActivityTypeEnum.Origination},${ActivityTypeEnum.Transaction}` +
        (isDefined(lastId) ? `&lastId=${lastId}` : '')
    )
  ).data;

export const getFa12IncomingOperations = async (
  selectedRpcUrl: string,
  account: string,
  lowerId: number,
  upperId: number | null
) =>
  (
    await getTzktApi(selectedRpcUrl).get<Array<OperationFa12Interface>>(
      `operations/transactions?sender.ne=${account}&target.ne=${account}&initiator.ne=${account}&id.gt=${lowerId}&entrypoint=transfer&parameter.to=${account}` +
        (isDefined(upperId) ? `&id.lt=${upperId}` : '')
    )
  ).data;

export const getFa2IncomingOperations = async (
  selectedRpcUrl: string,
  account: string,
  lowerId: number,
  upperId: number | null
) =>
  (
    await getTzktApi(selectedRpcUrl).get<Array<OperationFa2Interface>>(
      `operations/transactions?sender.ne=${account}&target.ne=${account}&initiator.ne=${account}&id.gt=${lowerId}&entrypoint=transfer&parameter.[*].txs.[*].to_=${account}` +
        (isDefined(upperId) ? `&id.lt=${upperId}` : '')
    )
  ).data;
