// import { from } from 'rxjs';
// import { map } from 'rxjs/operators';

import { tzktApi } from '../api.service';
import { OPERATION_LIMIT } from '../config/general';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { OperationFa12Interface, OperationFa2Interface, OperationInterface } from '../interfaces/operation.interface';
// import { TzktTokenTransfer } from '../interfaces/tzkt.interface';
import { isDefined } from './is-defined';
// import { mapOperationsToActivities } from './operation.utils';

// const limitOperations = 1000;
// const limitIncomingTransactions = 10000;
// const limitTransfers = 10000;

// all operations
// https://api.tzkt.io/v1/accounts/tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta/operations?type=delegation%2Corigination%2Ctransaction%2Creveal&lastId=270281840&limit=40&sort=1&quote=usd
// https://api.tzkt.io/v1/operations/transactions?sender.ne=tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta&target.ne=tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta&initiator.ne=tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta&entrypoint=transfer&parameter.to=tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta&id.gt=243493464&id.lt=270281840&status=applied&quote=usd
// https://api.tzkt.io/v1/operations/transactions?sender.ne=tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta&target.ne=tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta&initiator.ne=tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta&entrypoint=transfer&parameter.%5B*%5D.txs.%5B*%5D.to_=tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta&id.gt=243493464&id.lt=270281840&status=applied&quote=usd

// tezos
// https://api.tzkt.io/v1/accounts/tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta/operations?limit=40&type=transaction&sort=1&parameter.null&level.lt=123`
// fa2 (address, contract, tokenId)
// https://api.tzkt.io/v1/operations/transactions?entrypoint=transfer&status=applied&parameter.[*].in=[{%22from_%22:%22tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta%22,%20%22txs%22:[{%22token_id%22:%226%22}]},{%22txs%22:[{%22to_%22:%22tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta%22,%20%22token_id%22:%20%226%22}]}]&sort.desc=level&target=KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY
// fa1.2 (address, contract)
// https://api.tzkt.io/v1/operations/transactions?entrypoint=transfer&status=applied&parameter.in=[{%22from%22:%22tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta%22},{%22to%22:%22tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta%22}]&sort.desc=level&target=KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV

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
      (isDefined(lastLevel) ? `&level.lt=${lastLevel}` : '')
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

// const getTokenTransfers = (account: string) =>
//   tzktApi.get<Array<TzktTokenTransfer>>(`/tokens/transfers?anyof.from.to=${account}&limit=${limitTransfers}`);

// export const loadTokenOperations$ = (accountPublicKeyHash: string) =>
//   from(getTokenOperations(accountPublicKeyHash)).pipe(
//     map(({ data }) => mapOperationsToActivities(accountPublicKeyHash, data))
//   );

// export const loadIncomingFa12Operations$ = (accountPublicKeyHash: string) =>
//   from(getFa12IncomingOperations(accountPublicKeyHash)).pipe(
//     map(({ data }) => mapOperationsToActivities(accountPublicKeyHash, data))
//   );

// export const loadIncomingFa2Operations$ = (accountPublicKeyHash: string) =>
//   from(getFa2IncomingOperations(accountPublicKeyHash)).pipe(
//     map(({ data }) => mapOperationsToActivities(accountPublicKeyHash, data))
//   );

// export const loadTokenTransfers$ = (publicKeyHash: string) =>
//   from(getTokenTransfers(publicKeyHash)).pipe(
//     map(({ data }) =>
//       data.map(transfer => ({
//         ...transfer,
//         amount:
//           isDefined(transfer.from) && transfer.from.address === publicKeyHash ? `-${transfer.amount}` : transfer.amount
//       }))
//     )
//   );
