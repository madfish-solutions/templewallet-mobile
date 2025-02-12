import { uniq } from 'lodash-es';
import { stringify } from 'qs';

import { getTzktApi } from '../api.service';
import { OPERATION_LIMIT } from '../config/general';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { AccountInterface } from '../interfaces/account.interface';
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
import { getTokenType } from '../token/utils/token.utils';

import { isDefined } from './is-defined';
import { mapOperationsToActivities } from './operation.utils';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';
import { sleep } from './timeouts.util';

const getOperationGroupByHash = <T>(selectedRpcUrl: string, hash: string) =>
  getTzktApi(selectedRpcUrl).get<Array<T>>(`operations/${hash}`);

// LIQUIDITY BAKING ACTIVITY
const getContractOperations = <T>(
  selectedRpcUrl: string,
  account: string,
  contractAddress: string,
  lastLevel?: number
) =>
  getTzktApi(selectedRpcUrl)
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

const paramsSerializer = (params: Record<string, any>) => stringify(params);

const getTokenFa2Operations = (
  selectedRpcUrl: string,
  account: string,
  contractAddress: string,
  tokenId = '0',
  lastLevel?: number
) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<OperationFa2Interface>>('operations/transactions', {
      paramsSerializer,
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

const getTokenFa12Operations = (selectedRpcUrl: string, account: string, contractAddress: string, lastLevel?: number) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<OperationFa12Interface>>('operations/transactions', {
      paramsSerializer,
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

const getTezosOperations = (selectedRpcUrl: string, account: string, lastId?: number) =>
  getTzktApi(selectedRpcUrl)
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

const getAccountOperations = (selectedRpcUrl: string, account: string, lastId?: number) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<OperationInterface>>(`accounts/${account}/operations`, {
      params: {
        limit: OPERATION_LIMIT,
        type: `${ActivityTypeEnum.Delegation},${ActivityTypeEnum.Origination},${ActivityTypeEnum.Transaction}`,
        sort: '1',
        ...(isDefined(lastId) ? { lastId } : undefined)
      }
    })
    .then(x => x.data);

const getFa12IncomingOperations = (selectedRpcUrl: string, account: string, lowerId: number, upperId?: number) =>
  getTzktApi(selectedRpcUrl)
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

const getFa2IncomingOperations = (selectedRpcUrl: string, account: string, lowerId: number, upperId?: number) =>
  getTzktApi(selectedRpcUrl)
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

const getAllOperations = async (
  selectedRpcUrl: string,
  publicKeyHash: string,
  upperId?: number
): Promise<OperationInterface[]> => {
  const operations = await getAccountOperations(selectedRpcUrl, publicKeyHash, upperId);
  if (operations.length === 0) {
    return [];
  }
  const localLastItem = operations[operations.length - 1];
  if (!isDefined(localLastItem)) {
    return [];
  }
  const lowerId = localLastItem.id;
  const [operationsFa12, operationsFa2] = await Promise.all([
    getFa12IncomingOperations(selectedRpcUrl, publicKeyHash, lowerId, upperId),
    getFa2IncomingOperations(selectedRpcUrl, publicKeyHash, lowerId, upperId)
  ]);

  return operations
    .concat(operationsFa12)
    .concat(operationsFa2)
    .sort((b, a) => a.id - b.id);
};

const loadOperations = async (
  selectedRpcUrl: string,
  selectedAccount: AccountInterface,
  tokenSlug?: string,
  lastItem?: ActivityInterface
) => {
  const [contractAddress, tokenId] = (tokenSlug ?? '').split('_');

  if (isDefined(tokenSlug)) {
    if (tokenSlug === TEZ_TOKEN_SLUG) {
      return getTezosOperations(selectedRpcUrl, selectedAccount.publicKeyHash, lastItem?.id);
    }

    if (tokenSlug === LIQUIDITY_BAKING_DEX_ADDRESS) {
      return getContractOperations<OperationLiquidityBakingInterface>(
        selectedRpcUrl,
        selectedAccount.publicKeyHash,
        contractAddress,
        lastItem?.level
      );
    }

    const tezos = createReadOnlyTezosToolkit(selectedRpcUrl, selectedAccount);
    const contract = await tezos.contract.at(contractAddress);
    const tokenType = getTokenType(contract);

    if (tokenType === TokenTypeEnum.FA_1_2) {
      return getTokenFa12Operations(selectedRpcUrl, selectedAccount.publicKeyHash, contractAddress, lastItem?.level);
    }

    if (tokenType === TokenTypeEnum.FA_2) {
      return getTokenFa2Operations(
        selectedRpcUrl,
        selectedAccount.publicKeyHash,
        contractAddress,
        tokenId,
        lastItem?.level
      );
    }
  }

  return getAllOperations(selectedRpcUrl, selectedAccount.publicKeyHash, lastItem?.id);
};

export const loadActivity = async (
  selectedRpcUrl: string,
  /** @deprecated // Wanna pass PKH only */
  selectedAccount: AccountInterface,
  tokenSlug?: string,
  lastItem?: ActivityInterface
) => {
  const operationsHashes = await loadOperations(selectedRpcUrl, selectedAccount, tokenSlug, lastItem)
    .then(operations => operations.map(operation => operation.hash))
    .then(newHashes => uniq(newHashes.filter(x => x !== lastItem?.hash)));

  const operationGroups = [];

  for (const opHash of operationsHashes) {
    const { data } = await getOperationGroupByHash<OperationInterface>(selectedRpcUrl, opHash);
    operationGroups.push(data);
    await sleep(100);
  }

  return operationGroups.map(group => mapOperationsToActivities(selectedAccount.publicKeyHash, group));
};
