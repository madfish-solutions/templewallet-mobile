import { tzktApi } from '../api.service';
import { OPERATION_LIMIT } from '../config/general';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { OperationFa12Interface, OperationFa2Interface, OperationInterface } from '../interfaces/operation.interface';
import { isDefined } from './is-defined';

export const getTokenFa2Operations = (
  account: string,
  contractAddress: string,
  tokenId = '0',
  lastLevel: number | null
) =>
  tzktApi.get<Array<OperationFa2Interface>>(
    `operations/transactions?limit=${OPERATION_LIMIT}&entrypoint=transfer&status=applied&parameter.[*].in=[{"from_":"${account}","txs":[{"token_id":"${tokenId}"}]},{"txs":[{"to_":"${account}","token_id":"${tokenId}"}]}]&sort.desc=level&target=${contractAddress}` +
      (isDefined(lastLevel) ? `&level.lt=${lastLevel}` : '')
  );

export const getTokenFa12Operations = (account: string, contractAddress: string, lastLevel: number | null) =>
  tzktApi.get<Array<OperationFa12Interface>>(
    `operations/transactions?limit=${OPERATION_LIMIT}&entrypoint=transfer&status=applied&parameter.in=[{"from":"${account}"},{"to":"${account}"}]&sort.desc=level&target=${contractAddress}` +
      (isDefined(lastLevel) ? `&level.lt=${lastLevel}` : '')
  );

export const getTezosOperations = (account: string, lastLevel: number | null) =>
  tzktApi.get<Array<OperationInterface>>(
    `accounts/${account}/operations?limit=${OPERATION_LIMIT}&type=${ActivityTypeEnum.Transaction}&sort=1&parameter.null` +
      (isDefined(lastLevel) ? `&lastId=${lastLevel}` : '')
  );

export const getTokenOperations = (account: string, lastId: number | null) =>
  tzktApi.get<Array<OperationInterface>>(
    `accounts/${account}/operations?limit=${OPERATION_LIMIT}&sort=1&type=${ActivityTypeEnum.Delegation},${ActivityTypeEnum.Origination},${ActivityTypeEnum.Transaction}` +
      (isDefined(lastId) ? `&lastId=${lastId}` : '')
  );

export const getFa12IncomingOperations = (account: string, lowerId: number, upperId: number | null) =>
  tzktApi.get<Array<OperationFa12Interface>>(
    `operations/transactions?sender.ne=${account}&target.ne=${account}&initiator.ne=${account}&status=applied&id.gt=${lowerId}&entrypoint=transfer&parameter.to=${account}` +
      (isDefined(upperId) ? `&id.lt=${upperId}` : '')
  );

export const getFa2IncomingOperations = (account: string, lowerId: number, upperId: number | null) =>
  tzktApi.get<Array<OperationFa2Interface>>(
    `operations/transactions?sender.ne=${account}&target.ne=${account}&initiator.ne=${account}&status=applied&id.gt=${lowerId}&entrypoint=transfer&parameter.[*].txs.[*].to_=${account}` +
      (isDefined(upperId) ? `&id.lt=${upperId}` : '')
  );
