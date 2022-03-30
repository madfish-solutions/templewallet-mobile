import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import { MemberInterface } from '../interfaces/member.interface';
import { OperationInterface } from '../interfaces/operation.interface';
import { isDefined } from './is-defined';

export const mapOperationsToActivities = (address: string, operations: OperationInterface[]) => {
  const activities: ActivityInterface[] = [];

  for (const operation of operations) {
    const { type, status, hash, timestamp, hasInternals, target } = operation;

    if (!(hasInternals === true && address === target.address) && status === ActivityStatusEnum.Applied) {
      const newActivity = getActivityByType(operation, address);
      if (!isDefined(newActivity)) {
        continue;
      }
      const { source, entrypoint, destination, amount } = newActivity;

      activities.push({
        type,
        hash,
        status,
        source,
        entrypoint,
        destination,
        amount: source.address === address ? `-${amount}` : amount,
        timestamp: new Date(timestamp).getTime()
      });
    }
  }

  return activities;
};

export const extractEntrypoint = (operationParameters?: string): string => {
  try {
    if (isDefined(operationParameters)) {
      const entrypoint = operationParameters.match(/{"entrypoint":"[^"]*/g)?.map(i => i.slice(15));

      if (isDefined(entrypoint) && isDefined(entrypoint[0])) {
        return entrypoint[0];
      }
    }
  } catch {}

  return '';
};

interface ActivityTarget {
  source: MemberInterface;
  entrypoint: string;
  amount: string;
  destination: MemberInterface;
}

const getActivityByType = (operation: OperationInterface, address: string): ActivityTarget | undefined => {
  const { type, parameters, target, newDelegate, originatedContract, contractBalance, sender } = operation;
  let destination: MemberInterface = { address: '' };
  let amount = '0';
  let entrypoint = '';

  switch (type) {
    case ActivityTypeEnum.Transaction:
      if (address !== target.address && address !== sender.address) {
        return;
      }
      destination = target;
      amount = operation.amount.toString();
      entrypoint = extractEntrypoint(parameters);
      break;

    case ActivityTypeEnum.Delegation:
      if (address !== sender.address) {
        return;
      }
      isDefined(newDelegate) && (destination = newDelegate);
      amount = '0';
      break;

    case ActivityTypeEnum.Origination:
      isDefined(originatedContract) && (destination = originatedContract);
      isDefined(contractBalance) && (amount = contractBalance.toString());
      break;

    default:
      console.log(`Ignoring kind ${type}`);

      return;
  }

  return {
    source: sender,
    entrypoint,
    amount,
    destination
  };
};
