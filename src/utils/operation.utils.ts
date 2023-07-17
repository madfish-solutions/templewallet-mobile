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
    const reciever: MemberInterface = { address: '' };
    let amount = '0';
    let tokenId = null;
    let contractAddress = null;

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
          contractAddress = target.address;
          let isUserSenderOrReceiverOfFa2Operation = false;
          if (fa2Parameter.value[0].from_ === address) {
            amount = fa2Parameter.value[0].txs.reduce((acc, tx) => acc.plus(tx.amount), new BigNumber(0)).toFixed();
            source.address = address;
            isUserSenderOrReceiverOfFa2Operation = true;
            tokenId = fa2Parameter.value[0].txs[0].token_id;
            reciever.address = fa2Parameter.value[0].txs[0].to_;
          }
          for (const param of fa2Parameter.value) {
            const val = param.txs.find(tx => {
              return tx.to_ === address && (amount = tx.amount);
            });
            if (isDefined(val)) {
              isUserSenderOrReceiverOfFa2Operation = true;
              amount = val.amount;
              tokenId = val.token_id;
            }
          }
          if (!isUserSenderOrReceiverOfFa2Operation) {
            continue;
          }
        } else if (isDefined(fa12Parameter) && isDefined(fa12Parameter.value.value)) {
          if (fa12Parameter.entrypoint === 'approve') {
            continue;
          }
          if (isDefined(fa12Parameter.value.from) || isDefined(fa12Parameter.value.to)) {
            reciever.address = fa12Parameter.value.to;
            if (fa12Parameter.value.from === address) {
              source.address = address;
            } else if (fa12Parameter.value.to === address) {
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
        } else {
          reciever.address = target.address;
        }
        if (
          !isDefined(operation.parameter) &&
          operation.target.address !== address &&
          operation.sender.address !== address
        ) {
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
      ...(isDefined(tokenId) ? { tokenId } : {}),
      ...(isDefined(contractAddress) ? { address: contractAddress } : {}),
      id,
      type,
      hash,
      status: stringToActivityStatusEnum(status),
      source,
      entrypoint,
      level,
      destination,
      reciever,
      amount: source.address === address ? `-${amount}` : amount,
      timestamp: new Date(timestamp).getTime()
    });
  }

  return activities;
};
