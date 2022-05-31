import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { tzktApi } from '../api.service';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { OperationInterface } from '../interfaces/operation.interface';
import { TzktTokenTransfer } from '../interfaces/tzkt.interface';
import { isDefined } from './is-defined';
import { mapOperationsToActivities } from './operation.utils';

const limitOperations = 1000;
const limitTransfers = 10000;

const getTokenOperations = (account: string) =>
  tzktApi.get<Array<OperationInterface>>(
    `accounts/${account}/operations?limit=${limitOperations}&type=${ActivityTypeEnum.Delegation},${ActivityTypeEnum.Origination},${ActivityTypeEnum.Transaction}`
  );

const getTokenTransfers = (account: string) =>
  tzktApi.get<Array<TzktTokenTransfer>>(`/tokens/transfers?anyof.from.to=${account}&limit=${limitTransfers}`);

export const loadTokenOperations$ = (accountPublicKeyHash: string) =>
  from(getTokenOperations(accountPublicKeyHash)).pipe(
    map(({ data }) => mapOperationsToActivities(accountPublicKeyHash, data))
  );

export const loadTokenTransfers$ = (publicKeyHash: string) =>
  from(getTokenTransfers(publicKeyHash)).pipe(
    map(({ data }) =>
      data.map(transfer => ({
        ...transfer,
        amount:
          isDefined(transfer.from) && transfer.from.address === publicKeyHash ? `-${transfer.amount}` : transfer.amount
      }))
    )
  );
