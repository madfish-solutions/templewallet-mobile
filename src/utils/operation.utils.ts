import { OpKind, WalletParamsWithKind } from '@taquito/taquito';

import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import { MemberInterface } from '../interfaces/member.interface';
import { OperationInterface } from '../interfaces/operation.interface';
import { tokenMetadataSlug } from '../token/utils/token.utils';
import { tryParseExpenses } from './expenses.util';
import { isDefined } from './is-defined';

export const mapOperationsToActivities = (address: string, operations: OperationInterface[]) => {
  const activities: ActivityInterface[] = [];

  for (const operation of operations) {
    const {
      type,
      status,
      hash,
      timestamp,
      parameters,
      hasInternals,
      contractBalance,
      sender,
      target,
      newDelegate,
      originatedContract
    } = operation;

    if (!(hasInternals && address === target.address) && status === ActivityStatusEnum.Applied) {
      const source = sender;
      let destination: MemberInterface = { address: '' };
      let amount = '0';
      let entrypoint = '';

      switch (type) {
        case ActivityTypeEnum.Transaction:
          if (address !== target.address && address !== source.address) {
            continue;
          }
          destination = target;
          amount = operation.amount.toString();
          entrypoint = extractEntrypoint(parameters);
          break;

        case ActivityTypeEnum.Delegation:
          if (address !== source.address) {
            continue;
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

          continue;
      }

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
  } catch (e) {
    console.log(e);
  }

  return '';
};

export const mapParamsWithKindToPartialActivities = (address: string, operations: WalletParamsWithKind[]) => {
  return operations.map(operationParams => {
    switch (operationParams.kind) {
      case OpKind.TRANSACTION:
        const expenses = tryParseExpenses([operationParams], address);
        const firstExpense = expenses[0].expenses[0];

        return {
          type: ActivityTypeEnum.Transaction,
          amount: firstExpense?.amount.toString() ?? '0',
          tokenSlug:
            firstExpense?.tokenAddress &&
            tokenMetadataSlug({ address: firstExpense.tokenAddress, id: firstExpense.tokenId }),
          entrypoint: operationParams.parameter?.entrypoint,
          destination: {
            address: expenses[0].expenses[0]?.to
          }
        };
      case OpKind.DELEGATION:
        return {
          type: ActivityTypeEnum.Delegation,
          amount: '0',
          entrypoint: '',
          destination: {
            address: operationParams.delegate
          }
        };
      default:
        return {
          type: ActivityTypeEnum.Origination,
          amount: '0',
          entrypoint: '',
          destination: {
            address: ''
          }
        };
    }
  });
};
