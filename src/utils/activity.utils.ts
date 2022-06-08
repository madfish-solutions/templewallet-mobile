import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityGroup, ActivityInterface, emptyActivity } from '../interfaces/activity.interface';
import { TzktTokenTransfer } from '../interfaces/tzkt.interface';
import { isDefined } from './is-defined';

export const groupActivitiesByHash = (
  operations: Array<ActivityInterface>,
  fa12Operations: Array<ActivityInterface>,
  fa2Operations: Array<ActivityInterface>,
  transfers: Array<TzktTokenTransfer>
) => {
  const result: ActivityGroup[] = [];

  const allOperations = [...fa12Operations, ...fa2Operations, ...operations].sort(
    (b, a) => a.level ?? 0 - (b.level ?? 0)
  );

  const enrichedOperations: Array<ActivityInterface> = allOperations.map(operation => {
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
