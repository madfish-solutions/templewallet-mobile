import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import { TransferInterface } from '../interfaces/transfer.interface';

export const mapTransfersToActivities = (address: string, transfers: TransferInterface[]) => {
  const activities: ActivityInterface[] = [];

  for (const transfer of transfers) {
    const { status, amount, hash, timestamp, sender, target } = transfer;

    if (status === ActivityStatusEnum.Applied) {
      // if (from === '') {
      //   source.address = contract;
      //   isDefined(alias) && (source.alias = alias);
      // }

      activities.push({
        hash,
        source: sender,
        status,
        destination: target,
        type: ActivityTypeEnum.Transaction,
        amount: sender.address === address ? `-${amount}` : `${amount}`,
        timestamp: new Date(timestamp).getTime()
      });
    }
  }

  return activities;
};
