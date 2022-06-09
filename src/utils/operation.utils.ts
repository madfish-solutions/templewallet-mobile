import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import { MemberInterface } from '../interfaces/member.interface';
import { OperationInterface } from '../interfaces/operation.interface';
import { isDefined } from './is-defined';
import { stringToActivityStatusEnum } from './string-to-activity-status-enum.util';

export const mapOperationsToActivities = (address: string, operations: Array<OperationInterface>) => {
  const activities: Array<ActivityInterface> = [];

  for (const operation of operations) {
    const {
      id,
      type,
      status,
      hash,
      timestamp,
      parameters,
      contractBalance,
      sender,
      target,
      level,
      newDelegate,
      originatedContract
    } = operation;

    const source = sender;
    let destination: MemberInterface = { address: '' };
    let amount = '0';
    let entrypoint = '';

    switch (type) {
      case ActivityTypeEnum.Transaction:
        destination = target;
        amount = operation.amount.toString();
        entrypoint = extractEntrypoint(parameters);
        break;

      case ActivityTypeEnum.Delegation:
        if (address !== source.address) {
          continue;
        }
        isDefined(newDelegate) && (destination = newDelegate);
        break;

      case ActivityTypeEnum.Origination:
        isDefined(originatedContract) && (destination = originatedContract);
        isDefined(contractBalance) && (amount = contractBalance.toString());
        break;

      default:
        continue;
    }

    activities.push({
      id,
      type,
      hash,
      status: stringToActivityStatusEnum(status),
      source,
      entrypoint,
      level,
      destination,
      amount: source.address === address ? `-${amount}` : amount,
      timestamp: new Date(timestamp).getTime()
    });
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
