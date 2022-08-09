import uniqBy from 'lodash-es/uniqBy';

import { getTzktApi } from '../api.service';
import { OPERATION_LIMIT } from '../config/general';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityGroup } from '../interfaces/activity.interface';
import {
  OperationFa12Interface,
  OperationFa2Interface,
  OperationInterface,
  OperationLiquidityBakingInterface
} from '../interfaces/operation.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { transformActivityInterfaceToActivityGroups } from './activity.utils';
import { isDefined } from './is-defined';
import { mapOperationLiquidityBakingToActivity, mapOperationsToActivities } from './operation.utils';

export const getOperationGroupByHash = <T>(selectedRpc: string, hash: string) =>
  getTzktApi(selectedRpc).get<Array<T>>(`operations/${hash}`);

// LIQUIDITY BAKING ACTIVITY
export const getContractOperations = async <T>(
  selectedRpc: string,
  account: string,
  contractAddress: string,
  lastLevel: number | null
) =>
  (
    await getTzktApi(selectedRpc).get<Array<T>>(`accounts/${contractAddress}/operations`, {
      params: {
        type: 'transaction',
        limit: OPERATION_LIMIT,
        sort: '1',
        initiator: account,
        entrypoint: 'mintOrBurn',
        ...(isDefined(lastLevel) ? { 'level.lt': lastLevel } : undefined)
      }
    })
  ).data;

// FA2 TOKEN ACTIVITY
export const getTokenFa2Operations = async (
  selectedRpc: string,
  account: string,
  contractAddress: string,
  tokenId = '0',
  lastLevel: number | null
) =>
  (
    await getTzktApi(selectedRpc).get<Array<OperationFa2Interface>>('operations/transactions', {
      params: {
        limit: OPERATION_LIMIT,
        entrypoint: 'transfer',
        'sort.desc': 'level',
        target: contractAddress,
        'parameter.[*].in': `[{"from_":"${account}","txs":[{"token_id":"${tokenId}"}]},{"txs":[{"to_":"${account}","token_id":"${tokenId}"}]}]`,
        ...(isDefined(lastLevel) ? { 'level.lt': lastLevel } : undefined)
      }
    })
  ).data;

// FA1_2 TOKEN ACTIVITY
export const getTokenFa12Operations = async (
  selectedRpc: string,
  account: string,
  contractAddress: string,
  lastLevel: number | null
) =>
  (
    await getTzktApi(selectedRpc).get<Array<OperationFa12Interface>>('operations/transactions', {
      params: {
        limit: OPERATION_LIMIT,
        entrypoint: 'transfer',
        'sort.desc': 'level',
        target: contractAddress,
        'parameter.in': `[{"from":"${account}"},{"to":"${account}"}]`,
        ...(isDefined(lastLevel) ? { 'level.lt': lastLevel } : undefined)
      }
    })
  ).data;

// TOKEN ACTIVITY
export const getTezosOperations = async (selectedRpc: string, account: string, lastId: number | null) =>
  (
    await getTzktApi(selectedRpc).get<Array<OperationInterface>>(`accounts/${account}/operations`, {
      params: {
        limit: OPERATION_LIMIT,
        type: ActivityTypeEnum.Transaction,
        sort: '1',
        'parameter.null': true,
        ...(isDefined(lastId) ? { lastId } : undefined)
      }
    })
  ).data;

// GENERAL ACTIVITY
export const getTokenOperations = async (selectedRpc: string, account: string, lastId: number | null) =>
  (
    await getTzktApi(selectedRpc).get<Array<OperationInterface>>(`accounts/${account}/operations`, {
      params: {
        limit: OPERATION_LIMIT,
        type: `${ActivityTypeEnum.Delegation},${ActivityTypeEnum.Origination},${ActivityTypeEnum.Transaction}`,
        sort: '1',
        ...(isDefined(lastId) ? { lastId } : undefined)
      }
    })
  ).data;

export const getFa12IncomingOperations = async (
  selectedRpc: string,
  account: string,
  lowerId: number,
  upperId: number | null
) =>
  (
    await getTzktApi(selectedRpc).get<Array<OperationFa12Interface>>('operations/transactions', {
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
  ).data;

export const getFa2IncomingOperations = async (
  selectedRpc: string,
  account: string,
  lowerId: number,
  upperId: number | null
) =>
  (
    await getTzktApi(selectedRpc).get<Array<OperationFa2Interface>>('operations/transactions', {
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
  ).data;

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
  selectedRpc: string;
  lastLevel: number | null;
  publicKeyHash: string;
  contractAddress: string;
  tokenId: string;
  tokenType: LoadLastActivityType;
  setIsAllLoaded: (boo: boolean) => void;
  setActivities: (values: (prevValues: Array<ActivityGroup>) => Array<ActivityGroup>) => void;
}

export const loadLastActivity = async ({
  selectedRpc,
  lastLevel,
  publicKeyHash,
  contractAddress,
  tokenId,
  tokenType,
  setIsAllLoaded,
  setActivities
}: LoadLastActivityProps) => {
  if (tokenType === LoadLastActivityTokenType.All) {
    const operations = await getTokenOperations(selectedRpc, publicKeyHash, lastLevel);
    if (operations.length === 0) {
      return;
    }
    const filteredOperations = uniqBy<OperationInterface>(operations, 'hash');
    const operationGroups = (
      await Promise.all(
        filteredOperations.map(x => getOperationGroupByHash<OperationInterface>(selectedRpc, x.hash).then(x => x.data))
      )
    ).flat();
    const localLastItem = operationGroups[operationGroups.length - 1];
    if (!isDefined(localLastItem)) {
      setIsAllLoaded(true);

      return;
    }
    const lowerId = localLastItem.id;
    const operationsFa12 = await getFa12IncomingOperations(selectedRpc, publicKeyHash, lowerId, lastLevel);
    const operationsFa2 = await getFa2IncomingOperations(selectedRpc, publicKeyHash, lowerId, lastLevel);

    const filteredOperationsFa12 = uniqBy<OperationInterface>(operationsFa12, 'hash');
    const operationGroupsFa12 = (
      await Promise.all(
        filteredOperationsFa12.map(x =>
          getOperationGroupByHash<OperationFa12Interface>(selectedRpc, x.hash).then(x => x.data)
        )
      )
    ).flat();
    const filteredOperationsFa2 = uniqBy<OperationInterface>(operationsFa2, 'hash');
    const operationGroupsFa2 = (
      await Promise.all(
        filteredOperationsFa2.map(x =>
          getOperationGroupByHash<OperationFa2Interface>(selectedRpc, x.hash).then(x => x.data)
        )
      )
    ).flat();

    if (operationGroups.length === 0 && operationsFa12.length === 0 && operationsFa2.length === 0) {
      setIsAllLoaded(true);

      return;
    }

    const loadedActivities = mapOperationsToActivities(publicKeyHash, operationGroups);
    const loadedActivitiesFa12 = mapOperationsToActivities(publicKeyHash, operationGroupsFa12);
    const loadedActivitiesFa2 = mapOperationsToActivities(publicKeyHash, operationGroupsFa2);

    const allOperations = [...loadedActivitiesFa12, ...loadedActivitiesFa2, ...loadedActivities].sort(
      (b, a) => a.level ?? 0 - (b.level ?? 0)
    );
    const activityGroups = transformActivityInterfaceToActivityGroups(allOperations);

    setActivities(prevValue => [...prevValue, ...activityGroups]);

    return;
  }

  let operations: Array<OperationInterface> = [];
  switch (tokenType) {
    case TokenTypeEnum.FA_2:
      operations = await getTokenFa2Operations(selectedRpc, publicKeyHash, contractAddress, tokenId, lastLevel);
      break;
    case TokenTypeEnum.FA_1_2:
      operations = await getTokenFa12Operations(selectedRpc, publicKeyHash, contractAddress, lastLevel);
      break;
    case LoadLastActivityTokenType.Tezos:
      operations = await getTezosOperations(selectedRpc, publicKeyHash, lastLevel);
      break;
    case LoadLastActivityTokenType.LiquidityBaking:
      operations = await getContractOperations<OperationLiquidityBakingInterface>(
        selectedRpc,
        publicKeyHash,
        contractAddress,
        lastLevel
      );
      break;
    default:
      throw new Error('unimplemented');
  }

  const filteredOperations = uniqBy<OperationInterface>(operations, 'hash');

  setIsAllLoaded(filteredOperations.length === 0);

  const operationGroups = await Promise.all(
    filteredOperations.map(x => getOperationGroupByHash<OperationInterface>(selectedRpc, x.hash).then(x => x.data))
  );

  const activityGroups: Array<ActivityGroup> = [];
  for (const group of operationGroups) {
    switch (tokenType) {
      case TokenTypeEnum.FA_2:
        activityGroups.push(mapOperationsToActivities(publicKeyHash, group as Array<OperationFa2Interface>));
        break;
      case TokenTypeEnum.FA_1_2:
        activityGroups.push(mapOperationsToActivities(publicKeyHash, group as Array<OperationFa12Interface>));
        break;
      case LoadLastActivityTokenType.Tezos:
        activityGroups.push(mapOperationsToActivities(publicKeyHash, group));
        break;
      case LoadLastActivityTokenType.LiquidityBaking:
        activityGroups.push(
          mapOperationLiquidityBakingToActivity(publicKeyHash, group as Array<OperationLiquidityBakingInterface>)
        );
        break;
      default:
        throw new Error('unimplemented');
    }
  }

  setActivities((prevValue: Array<ActivityGroup>) => [...prevValue, ...activityGroups]);
};
