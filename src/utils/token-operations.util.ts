import uniqBy from 'lodash-es/uniqBy';

import { getTzktApi } from '../api.service';
import { OPERATION_LIMIT } from '../config/general';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import {
  OperationFa12Interface,
  OperationFa2Interface,
  OperationInterface,
  OperationLiquidityBakingInterface
} from '../interfaces/operation.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { LIQUIDITY_BAKING_DEX_ADDRESS } from '../token/data/token-slugs';
import { TEZ_TOKEN_SLUG } from '../token/data/tokens-metadata';
import { isDefined } from './is-defined';
import { mapOperationsToActivities } from './operation.utils';

export const getOperationGroupByHash = <T>(selectedRpc: string, hash: string) =>
  getTzktApi(selectedRpc).get<Array<T>>(`operations/${hash}`);

// LIQUIDITY BAKING ACTIVITY
export const getContractOperations = <T>(
  selectedRpc: string,
  account: string,
  contractAddress: string,
  lastLevel: number | null
) =>
  getTzktApi(selectedRpc)
    .get<Array<T>>(`accounts/${contractAddress}/operations`, {
      params: {
        type: 'transaction',
        limit: OPERATION_LIMIT,
        sort: '1',
        initiator: account,
        entrypoint: 'mintOrBurn',
        ...(isDefined(lastLevel) ? { 'level.lt': lastLevel } : undefined)
      }
    })
    .then(x => x.data);

// FA2 TOKEN ACTIVITY
export const getTokenFa2Operations = (
  selectedRpc: string,
  account: string,
  contractAddress: string,
  tokenId = '0',
  lastLevel: number | null
) =>
  getTzktApi(selectedRpc)
    .get<Array<OperationFa2Interface>>('operations/transactions', {
      params: {
        limit: OPERATION_LIMIT,
        entrypoint: 'transfer',
        'sort.desc': 'level',
        target: contractAddress,
        'parameter.[*].in': `[{"from_":"${account}","txs":[{"token_id":"${tokenId}"}]},{"txs":[{"to_":"${account}","token_id":"${tokenId}"}]}]`,
        ...(isDefined(lastLevel) ? { 'level.lt': lastLevel } : undefined)
      }
    })
    .then(x => x.data);

// FA1_2 TOKEN ACTIVITY
export const getTokenFa12Operations = (
  selectedRpc: string,
  account: string,
  contractAddress: string,
  lastLevel: number | null
) =>
  getTzktApi(selectedRpc)
    .get<Array<OperationFa12Interface>>('operations/transactions', {
      params: {
        limit: OPERATION_LIMIT,
        entrypoint: 'transfer',
        'sort.desc': 'level',
        target: contractAddress,
        'parameter.in': `[{"from":"${account}"},{"to":"${account}"}]`,
        ...(isDefined(lastLevel) ? { 'level.lt': lastLevel } : undefined)
      }
    })
    .then(x => x.data);

// TOKEN ACTIVITY
export const getTezosOperations = (selectedRpc: string, account: string, lastId: number | null) =>
  getTzktApi(selectedRpc)
    .get<Array<OperationInterface>>(`accounts/${account}/operations`, {
      params: {
        limit: OPERATION_LIMIT,
        type: ActivityTypeEnum.Transaction,
        sort: '1',
        'parameter.null': true,
        ...(isDefined(lastId) ? { lastId } : undefined)
      }
    })
    .then(x => x.data);

// GENERAL ACTIVITY
export const getTokenOperations = (selectedRpc: string, account: string, lastId: number | null) =>
  getTzktApi(selectedRpc)
    .get<Array<OperationInterface>>(`accounts/${account}/operations`, {
      params: {
        limit: OPERATION_LIMIT,
        type: `${ActivityTypeEnum.Delegation},${ActivityTypeEnum.Origination},${ActivityTypeEnum.Transaction}`,
        sort: '1',
        ...(isDefined(lastId) ? { lastId } : undefined)
      }
    })
    .then(x => x.data);

export const getFa12IncomingOperations = (
  selectedRpc: string,
  account: string,
  lowerId: number,
  upperId: number | null
) =>
  getTzktApi(selectedRpc)
    .get<Array<OperationFa12Interface>>('operations/transactions', {
      params: {
        'sender.ne': account,
        'target.ne': account,
        'initiator.ne': account,
        'id.gt': lowerId,
        entrypoint: 'transfer',
        'parameter.to': account,
        ...(isDefined(upperId) ? { 'id.lt': upperId } : undefined)
      }
    })
    .then(x => x.data);

export const getFa2IncomingOperations = async (
  selectedRpc: string,
  account: string,
  lowerId: number,
  upperId: number | null
) =>
  getTzktApi(selectedRpc)
    .get<Array<OperationFa2Interface>>('operations/transactions', {
      params: {
        'sender.ne': account,
        'target.ne': account,
        'initiator.ne': account,
        'id.gt': lowerId,
        entrypoint: 'transfer',
        'parameter.[*].txs.[*].to_': account,
        ...(isDefined(upperId) ? { 'id.lt': upperId } : undefined)
      }
    })
    .then(x => x.data);

export const getAllOperations = async (
  selectedRpc: string,
  publicKeyHash: string,
  lastLevel: number | null
): Promise<OperationInterface[]> => {
  const operations = await getTokenOperations(selectedRpc, publicKeyHash, lastLevel);
  if (operations.length === 0) {
    return [];
  }
  const localLastItem = operations[operations.length - 1];
  if (!isDefined(localLastItem)) {
    return [];
  }
  const lowerId = localLastItem.id;
  const [operationsFa12, operationsFa2] = await Promise.all([
    getFa12IncomingOperations(selectedRpc, publicKeyHash, lowerId, lastLevel),
    getFa2IncomingOperations(selectedRpc, publicKeyHash, lowerId, lastLevel)
  ]);

  return operations.concat(operationsFa12).concat(operationsFa2);
};

export enum LoadLastActivityTokenType {
  Tezos = 'Tezos',
  LiquidityBaking = 'LiquidityBaking',
  All = 'All'
}
export type LoadLastActivityType =
  | TokenTypeEnum.FA_2
  | TokenTypeEnum.FA_1_2
  | LoadLastActivityTokenType.Tezos
  | LoadLastActivityTokenType.All
  | LoadLastActivityTokenType.LiquidityBaking;

interface LoadLastActivityProps {
  selectedRpcUrl: string;
  lastItem: ActivityInterface | null;
  publicKeyHash: string;
  tokenSlug?: string;
  tokenType: TokenTypeEnum;
}

export const loadLastActivity = async ({
  selectedRpcUrl,
  lastItem,
  publicKeyHash,
  tokenSlug,
  tokenType
}: LoadLastActivityProps) => {
  let operations: Array<OperationInterface> = [];

  const [contractAddress, tokenId] = (tokenSlug ?? '').split('_');

  let activityType: LoadLastActivityType = tokenType;
  if (isDefined(tokenSlug)) {
    switch (tokenSlug) {
      case TEZ_TOKEN_SLUG:
        activityType = LoadLastActivityTokenType.Tezos;
        break;
      case LIQUIDITY_BAKING_DEX_ADDRESS:
        activityType = LoadLastActivityTokenType.LiquidityBaking;
        break;
      default:
        activityType = tokenType;
    }
  } else {
    activityType = LoadLastActivityTokenType.All;
  }

  const lastLevelOrLastId = isDefined(lastItem)
    ? activityType === TokenTypeEnum.FA_1_2 ||
      activityType === TokenTypeEnum.FA_2 ||
      activityType === LoadLastActivityTokenType.LiquidityBaking
      ? lastItem.level ?? null
      : lastItem.id ?? null
    : null;

  switch (activityType) {
    case LoadLastActivityTokenType.All:
      operations = await getAllOperations(selectedRpcUrl, publicKeyHash, lastLevelOrLastId);
      break;
    case TokenTypeEnum.FA_2:
      operations = await getTokenFa2Operations(
        selectedRpcUrl,
        publicKeyHash,
        contractAddress,
        tokenId,
        lastLevelOrLastId
      );
      break;
    case TokenTypeEnum.FA_1_2:
      operations = await getTokenFa12Operations(selectedRpcUrl, publicKeyHash, contractAddress, lastLevelOrLastId);
      break;
    case LoadLastActivityTokenType.Tezos:
      operations = await getTezosOperations(selectedRpcUrl, publicKeyHash, lastLevelOrLastId);
      break;
    case LoadLastActivityTokenType.LiquidityBaking:
      operations = await getContractOperations<OperationLiquidityBakingInterface>(
        selectedRpcUrl,
        publicKeyHash,
        contractAddress,
        lastLevelOrLastId
      );
      break;
  }

  const filteredOperations = uniqBy<OperationInterface>(operations, 'hash');

  if (filteredOperations.length === 0) {
    return [];
  }

  const operationGroups = await Promise.all(
    filteredOperations.map(x => getOperationGroupByHash<OperationInterface>(selectedRpcUrl, x.hash).then(x => x.data))
  );

  return operationGroups.map(group => mapOperationsToActivities(publicKeyHash, group));
};
