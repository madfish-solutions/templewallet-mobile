import { BigNumber } from 'bignumber.js';

import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import { MemberInterface } from '../interfaces/member.interface';
import {
  OperationInterface,
  ParameterFa12,
  ParameterLiquidityBaking,
  ParamterFa2
} from '../interfaces/operation.interface';

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
      originatedContract,
      parameter
    } = operation;

    const source = sender;
    let destination: MemberInterface = { address: '' };
    let amount = '0';
    let contractAddress = null;

    const activityBase = {
      id,
      type,
      hash,
      status: stringToActivityStatusEnum(status),
      entrypoint,
      level,
      timestamp: new Date(timestamp).getTime()
    };

    switch (type) {
      case ActivityTypeEnum.Transaction:
        destination = target;
        amount = operation.amount.toString();
        const fa2Parameter = parameter as ParamterFa2;
        const fa12Parameter = parameter as ParameterFa12;
        const bakingParameter = parameter as ParameterLiquidityBaking;

        if (
          isDefined(fa2Parameter) &&
          fa2Parameter.value.length > 0 &&
          Array.isArray(fa2Parameter.value) &&
          isDefined(fa2Parameter.value[0].txs)
        ) {
          const receivals: StringRecord<{ amount: BigNumber; from: string }> = {};
          const sendings: StringRecord<{ amount: BigNumber; to: string }> = {};

          for (const { from_, txs } of fa2Parameter.value) {
            for (const { amount, to_, token_id } of txs) {
              const parsedAmount = new BigNumber(amount);
              if (from_ === to_ || parsedAmount.isZero()) {
                continue;
              }

              if (from_ === address && sendings[token_id]) {
                sendings[token_id].amount = sendings[token_id].amount.plus(parsedAmount);
              } else if (from_ === address) {
                sendings[token_id] = { amount: parsedAmount, to: to_ };
              } else if (to_ === address && receivals[token_id]) {
                receivals[token_id].amount = receivals[token_id].amount.plus(parsedAmount);
              } else if (to_ === address) {
                receivals[token_id] = { amount: parsedAmount, from: from_ };
              }
            }
          }

          if (Object.keys(receivals).length > 0 || Object.keys(sendings).length > 0) {
            for (const tokenId in receivals) {
              const { amount, from } = receivals[tokenId];
              activities.push({
                ...activityBase,
                tokenId,
                address: target.address,
                source: { address: from },
                destination: target,
                amount: amount.toFixed()
              });
            }
            for (const tokenId in sendings) {
              const { amount } = sendings[tokenId];
              activities.push({
                ...activityBase,
                tokenId,
                address: target.address,
                source: { address },
                destination: target,
                amount: amount.negated().toFixed()
              });
            }
          }

          continue;
        } else if (isDefined(fa12Parameter) && isDefined(fa12Parameter.value.value)) {
          if (fa12Parameter.entrypoint === 'approve') {
            continue;
          }
          if (isDefined(fa12Parameter.value.from) || isDefined(fa12Parameter.value.to)) {
            const { from, to } = fa12Parameter.value;

            if (from === to) {
              continue;
            }

            if (from === address) {
              source.address = address;
            } else if (to === address) {
              source.address = fa12Parameter.value.from;
            } else {
              continue;
            }
          }
          contractAddress = target.address;
          amount = fa12Parameter.value.value;
        } else if (isDefined(bakingParameter) && isDefined(bakingParameter.value.quantity)) {
          contractAddress = target.address;
          const tokenOrTezAmount =
            isDefined(parameter) && isDefined((parameter as ParameterFa12).value.value)
              ? (parameter as ParameterFa12).value.value
              : amount.toString();
          amount =
            isDefined(parameter) && isDefined((parameter as ParameterLiquidityBaking).value.quantity)
              ? (parameter as ParameterLiquidityBaking).value.quantity
              : target.address === address ||
                (isDefined(parameter) && (parameter as ParameterFa12).value.to === address)
              ? tokenOrTezAmount
              : `-${tokenOrTezAmount}`;
        } else if (operation.target.address !== address && operation.sender.address !== address) {
          continue;
        }
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
      ...(isDefined(contractAddress) ? { address: contractAddress } : {}),
      ...activityBase,
      source,
      destination,
      amount: source.address === address ? `-${amount}` : amount
    });
  }

  return activities;
};
