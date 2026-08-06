import type { TzktOperation, TzktTransactionOperation } from 'src/apis/tzkt/types';
import {
  isTzktOperParam,
  isTzktOperParam_Fa12,
  isTzktOperParam_Fa2_approve,
  isTzktOperParam_Fa2_transfer,
  isTzktOperParam_LiquidityBaking,
  ParameterFa2Transfer
} from 'src/apis/tzkt/utils';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { isTruthy } from 'src/utils/is-truthy';
import { ZERO } from 'src/utils/number.util';

import type { OperationMember } from '../types';

import type {
  TempleTzktOperationsGroup,
  TezosPreActivity,
  TezosPreActivityOperation,
  TezosPreActivityOperationBase,
  TezosPreActivityOtherOperation,
  TezosPreActivityStatus,
  TezosPreActivityTransactionOperation
} from './types';

export function preparseTezosOperationsGroup(
  { hash, operations: groupOperations }: TempleTzktOperationsGroup,
  address: string,
  chainId: string
): TezosPreActivity | null {
  const lastOperation = groupOperations.at(-1);

  if (lastOperation == null) return null;

  const operations = groupOperations.map(operation => reduceOneTzktOperation(operation, address)).filter(isTruthy);

  return {
    hash,
    addedAt: lastOperation.timestamp,
    status: deriveActivityStatus(operations),
    operations,
    oldestTzktOperation: lastOperation,
    chainId
  };
}

/**
 * (i) Does not mutate an operation object
 */
function reduceOneTzktOperation(operation: TzktOperation, address: string): TezosPreActivityOperation | null {
  switch (operation.type) {
    case 'transaction':
      return reduceOneTzktTransactionOperation(address, operation);
    case 'delegation': {
      if (operation.sender.address !== address) return null;

      const activityOperBase = buildActivityOperBase(operation, '0', operation.sender.address === address);
      const activityOper: TezosPreActivityOtherOperation = {
        ...activityOperBase,
        sender: operation.sender,
        type: 'delegation'
      };
      if (operation.newDelegate) activityOper.destination = operation.newDelegate;

      return activityOper;
    }
    case 'origination': {
      const amount = operation.contractBalance ? operation.contractBalance.toString() : '0';
      const activityOperBase = buildActivityOperBase(operation, amount, operation.sender.address === address);
      const activityOper: TezosPreActivityOtherOperation = {
        ...activityOperBase,
        sender: operation.sender,
        type: 'origination'
      };
      if (operation.originatedContract) activityOper.destination = operation.originatedContract;

      return activityOper;
    }
    default:
      return null;
  }
}

function reduceOneTzktTransactionOperation(
  address: string,
  operation: TzktTransactionOperation
): TezosPreActivityTransactionOperation | null {
  function _buildReturn(args: {
    amount: string;
    from: OperationMember;
    to: OperationMember | string[];
    contract?: string;
    tokenId?: string;
    subtype?: TezosPreActivityTransactionOperation['subtype'];
  }) {
    const { amount, from, to, contract, tokenId, subtype } = args;

    const activityOperBase = buildActivityOperBase(
      operation,
      amount,
      subtype === 'approve' ? false : from.address === address
    );

    const activityOper: TezosPreActivityTransactionOperation = {
      ...activityOperBase,
      type: 'transaction',
      subtype,
      destination: operation.target,
      from,
      to: Array.isArray(to) ? to.map(toAddress => ({ address: toAddress })) : [to],
      contract,
      tokenId
    };

    if (isTzktOperParam(operation.parameter)) activityOper.entrypoint = operation.parameter.entrypoint;

    return activityOper;
  }

  const parameter = operation.parameter;

  if (parameter == null) {
    if (operation.target.address !== address && operation.sender.address !== address) return null;

    return _buildReturn({
      amount: String(operation.amount),
      from: operation.sender,
      to: operation.target,
      contract: TEZ_TOKEN_SLUG,
      subtype: 'transfer'
    });
  }

  if (isTzktOperParam_Fa2_transfer(parameter)) {
    const values = reduceParameterFa2TransferValues(parameter.value, address);
    const firstVal = values.at(0);
    // (!) Here we abandon other but 1st non-zero-amount values
    if (firstVal == null) return null;

    return _buildReturn({
      amount: firstVal.amount,
      from: { ...operation.sender, address: firstVal.fromAddress },
      to: firstVal.toAddresses,
      contract: operation.target.address,
      tokenId: firstVal.tokenId,
      subtype: 'transfer'
    });
  }

  if (isTzktOperParam_Fa2_approve(parameter)) {
    const addOperator = parameter.value[0].add_operator;

    return _buildReturn({
      amount: String(operation.amount),
      from: operation.sender,
      to: { address: addOperator.operator },
      contract: operation.target.address,
      tokenId: addOperator.token_id,
      subtype: 'approve'
    });
  }

  if (isTzktOperParam_Fa12(parameter)) {
    const contract = operation.target.address;

    if (parameter.entrypoint === 'approve') {
      const amount = parameter.value.value;

      if (amount === '0') return null;

      return _buildReturn({
        amount,
        from: operation.sender,
        to: { address: parameter.value.spender },
        contract,
        subtype: 'approve'
      });
    }

    return _buildReturn({
      amount: parameter.value.value,
      from: { ...operation.sender, address: parameter.value.from },
      to: { address: parameter.value.to },
      contract,
      subtype: 'transfer'
    });
  }

  if (isTzktOperParam_LiquidityBaking(parameter)) {
    return _buildReturn({
      amount: parameter.value.quantity,
      from: operation.sender,
      to: operation.target,
      contract: operation.target.address,
      subtype: 'transfer'
    });
  }

  return _buildReturn({
    amount: String(operation.amount),
    from: operation.sender,
    to: operation.target
  });
}

function buildActivityOperBase(operation: TzktOperation, amount: string, from: boolean) {
  const { id, level, sender, timestamp: addedAt } = operation;

  const reducedOperation: TezosPreActivityOperationBase = {
    id,
    level,
    sender,
    amountSigned: from ? `-${amount}` : amount,
    status: stringToActivityStatus(operation.status),
    addedAt
  };

  return reducedOperation;
}

interface ReducedParameterFa2Values {
  fromAddress: string;
  toAddresses: string[];
  amount: string;
  tokenId: string;
}

/**
 * Items with zero cumulative amount value are filtered out
 */
function reduceParameterFa2TransferValues(values: ParameterFa2Transfer['value'], relAddress: string) {
  const result: ReducedParameterFa2Values[] = [];

  for (const val of values) {
    const firstTx = val.txs.at(0);
    if (firstTx == null) continue;

    /*
      We assume, that all `val.txs` items have same `token_id` value.
      Visit https://tezos.b9lab.com/fa2 - There is a link to code in Smartpy IDE.
      Fa2 token-standard/smartcontract literally has it in its code.
    */
    const tokenId = firstTx.token_id;

    const fromAddress = val.from_;

    if (fromAddress === relAddress) {
      let amount = ZERO;
      const toAddresses = val.txs.map(tx => {
        amount = amount.plus(tx.amount);

        return tx.to_;
      });

      if (amount.isZero()) continue;

      result.push({ fromAddress, toAddresses, amount: amount.toFixed(), tokenId });

      continue;
    }

    const amount = val.txs.reduce((acc, tx) => (tx.to_ === relAddress ? acc.plus(tx.amount) : acc), ZERO);

    if (!amount.isZero()) {
      result.push({
        fromAddress,
        // Not interested in all the other `tx.to_`s at the moment
        toAddresses: [relAddress],
        amount: amount.toFixed(),
        tokenId
      });
    }
  }

  return result;
}

const KNOWN_TZKT_STATUSES: TezosPreActivityStatus[] = ['applied', 'backtracked', 'skipped', 'failed'];

export const isKnownTzktStatus = (status: string): status is TezosPreActivityStatus =>
  KNOWN_TZKT_STATUSES.some(knownStatus => knownStatus === status);

const stringToActivityStatus = (status: string): TezosPreActivityStatus =>
  isKnownTzktStatus(status) ? status : 'pending';

const STATUS_PRIORITY: TezosPreActivityStatus[] = ['pending', 'applied', 'backtracked', 'skipped', 'failed'];

function deriveActivityStatus(items: { status: TezosPreActivityStatus }[]): TezosPreActivityStatus {
  for (const status of STATUS_PRIORITY) {
    if (items.some(item => item.status === status)) return status;
  }

  return items.at(0)?.status ?? 'pending';
}
