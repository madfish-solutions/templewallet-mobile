import { BigNumber } from 'bignumber.js';

import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import { MemberInterface } from '../interfaces/member.interface';
import { OperationFa12Interface, OperationFa2Interface, OperationInterface } from '../interfaces/operation.interface';
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
      entrypoint,
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

    switch (type) {
      case ActivityTypeEnum.Transaction:
        destination = target;
        amount = operation.amount.toString();
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

export const mapOperationsFa12ToActivities = (address: string, operations: Array<OperationFa12Interface>) => {
  const activities: Array<ActivityInterface> = [];

  for (const operation of operations) {
    const { id, type, status, hash, timestamp, entrypoint, sender, target, level, parameter } = operation;

    const source = sender;
    const amount = parameter.value.to;

    activities.push({
      id,
      type,
      hash,
      status: stringToActivityStatusEnum(status),
      source,
      entrypoint,
      level,
      destination: target,
      amount: source.address === address ? `-${amount}` : amount,
      timestamp: new Date(timestamp).getTime()
    });
  }

  return activities;
};

export const mapOperationsFa2ToActivities = (address: string, operations: Array<OperationFa2Interface>) => {
  const activities: Array<ActivityInterface> = [];

  for (const operation of operations) {
    const { id, type, status, hash, timestamp, entrypoint, sender, target, level, parameter } = operation;

    const source = sender;
    let amount = '0';
    if (parameter.value.length > 0) {
      if (parameter.value[0].from_ === address) {
        amount = parameter.value[0].txs.reduce((acc, tx) => acc.plus(tx.amount), new BigNumber(0)).toFixed();
      }
      parameter.value.forEach(param => {
        const val = param.txs.find(tx => {
          return tx.to_ === address && (amount = tx.amount);
        });
        if (isDefined(val)) {
          amount = val.amount;
        }
      });
    }

    activities.push({
      id,
      type,
      hash,
      status: stringToActivityStatusEnum(status),
      source,
      entrypoint,
      level,
      destination: target,
      amount: source.address === address ? `-${amount}` : amount,
      timestamp: new Date(timestamp).getTime()
    });
  }

  return activities;
};
