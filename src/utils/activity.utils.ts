import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityGroup, ActivityInterface, emptyActivity } from '../interfaces/activity.interface';
import { TzktTokenTransfer } from '../interfaces/tzkt.interface';
import { isDefined } from './is-defined';

export const groupActivitiesByHash = (operations: Array<ActivityInterface>, transfers: Array<TzktTokenTransfer>) => {
  const result: ActivityGroup[] = [];

  const enrichedOperations: Array<ActivityInterface> = operations.map(operation => {
    if (operation.type === ActivityTypeEnum.Transaction) {
      const foundTransfer = transfers.find(transfer => transfer.transactionId === operation.id);
      if (isDefined(foundTransfer)) {
        return {
          ...operation,
          address: foundTransfer.token.contract.address,
          id: Number(foundTransfer.token.tokenId) ?? 0,
          amount: foundTransfer.amount
        };
      }
    }

    return operation;
  });

  const activities = enrichedOperations.sort((a, b) => b.timestamp - a.timestamp);
  let prevActivity: ActivityInterface = emptyActivity;

  for (const activity of activities) {
    if (activity.hash === prevActivity.hash) {
      result[result.length - 1].push(activity);
    } else {
      result.push([activity]);
    }

    prevActivity = activity;
  }

  return result;
};
