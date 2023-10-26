import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import { MemberInterface } from '../interfaces/member.interface';
import { TransferInterface } from '../interfaces/transfer.interface';

import { isDefined } from './is-defined';
import { stringToActivityStatusEnum } from './string-to-activity-status-enum.util';

export const mapTransfersToActivities = (address: string, transfers: TransferInterface[]) => {
  const activities: ActivityInterface[] = [];

  for (const transfer of transfers) {
    const { contract, token_id, status, amount, hash, timestamp, from, to, alias } = transfer;
    const source: MemberInterface = { address: from };
    const destination: MemberInterface = { address: to };

    if (from === '') {
      source.address = contract;
      isDefined(alias) && (source.alias = alias);
    }

    activities.push({
      hash,
      source,
      status: stringToActivityStatusEnum(status),
      destination,
      address: contract,
      id: token_id ?? 0,
      type: ActivityTypeEnum.Transaction,
      amount: source.address === address ? `-${amount}` : amount,
      timestamp: new Date(timestamp).getTime()
    });
  }

  return activities;
};
