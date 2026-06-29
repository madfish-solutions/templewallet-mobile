import { uniq } from 'lodash-es';
import { stringify } from 'qs';

import { tzktApi } from '../api.service';
import { OPERATION_LIMIT } from '../config/general';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { Account } from '../interfaces/account.interfaces';
import { ActivityInterface } from '../interfaces/activity.interface';
import {
  OperationFa12Interface,
  OperationFa2Interface,
  OperationInterface,
  OperationLiquidityBakingInterface
} from '../interfaces/operation.interface';
import { LIQUIDITY_BAKING_DEX_ADDRESS } from '../token/data/token-slugs';
import { TEZ_TOKEN_SLUG } from '../token/data/tokens-metadata';
import { TokenStandardsEnum } from '../token/interfaces/token-metadata.interface';
import { getTokenStandard } from '../token/utils/token.utils';

import { getAccountAddressForTezos, getAccountForTezos } from './account.utils';
import { isDefined } from './is-defined';
import { mapOperationsToActivities } from './operation.utils';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';
import { sleep } from './timeouts.util';

const getOperationGroupByHash = <T>(hash: string) => tzktApi.get<Array<T>>(`operations/${hash}`);

// LIQUIDITY BAKING ACTIVITY
const getContractOperations = <T>(account: string, contractAddress: string, lastLevel?: number) =>
  tzktApi
    .get<Array<T>>('/operations/transactions', {
      params: {
        target: contractAddress,
        initiator: account,
        limit: OPERATION_LIMIT,
        entrypoint: 'mintOrBurn',
        'sort.desc': 'level',
        ...(isDefined(lastLevel) ? { 'level.lt': lastLevel } : undefined)
      }
    })
    .then(x => x.data);

const paramsSerializer = (params: Record<string, unknown>) => stringify(params);

const getTokenFa2Operations = (account: string, contractAddress: string, tokenId = '0', lastLevel?: number) =>
  tzktApi
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

const getTokenFa12Operations = (account: string, contractAddress: string, lastLevel?: number) =>
  tzktApi
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

const getTezosOperations = (account: string, lastLevel?: number) =>
  tzktApi
    .get<Array<OperationInterface>>('operations/transactions', {
      params: {
        'anyof.sender.target.initiator': account,
        limit: OPERATION_LIMIT,
        'sort.desc': 'id',
        'amount.ne': '0',
        ...(isDefined(lastLevel) ? { 'level.lt': lastLevel } : undefined)
      }
    })
    .then(x => x.data);

const getAccountOperations = (account: string, lastId?: number) =>
  tzktApi
    .get<Array<OperationInterface>>('accounts/activity', {
      params: {
        addresses: account,
        limit: OPERATION_LIMIT,
        types: `${ActivityTypeEnum.Delegation},${ActivityTypeEnum.Origination},${ActivityTypeEnum.Transaction}`,
        sort: '1',
        ...(isDefined(lastId) ? { lastId } : undefined)
      }
    })
    .then(x => x.data);

const getFa12IncomingOperations = (account: string, lowerId: number, upperId?: number) =>
  tzktApi
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

const getFa2IncomingOperations = (account: string, lowerId: number, upperId?: number) =>
  tzktApi
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

const getAllOperations = async (publicKeyHash: string, upperId?: number): Promise<OperationInterface[]> => {
  const operations = await getAccountOperations(publicKeyHash, upperId);
  if (operations.length === 0) {
    return [];
  }
  const localLastItem = operations[operations.length - 1];
  if (!isDefined(localLastItem)) {
    return [];
  }
  const lowerId = localLastItem.id;
  const [operationsFa12, operationsFa2] = await Promise.all([
    getFa12IncomingOperations(publicKeyHash, lowerId, upperId),
    getFa2IncomingOperations(publicKeyHash, lowerId, upperId)
  ]);

  return operations
    .concat(operationsFa12)
    .concat(operationsFa2)
    .sort((b, a) => a.id - b.id);
};

const loadOperations = async (selectedAccount: Account, tokenSlug?: string, lastItem?: ActivityInterface) => {
  const [contractAddress, tokenId] = (tokenSlug ?? '').split('_');
  const selectedTezosAddress = getAccountAddressForTezos(selectedAccount);

  if (!selectedTezosAddress) {
    return [];
  }

  if (isDefined(tokenSlug)) {
    if (tokenSlug === TEZ_TOKEN_SLUG) {
      return getTezosOperations(selectedTezosAddress, lastItem?.level);
    }

    if (contractAddress === LIQUIDITY_BAKING_DEX_ADDRESS) {
      return getContractOperations<OperationLiquidityBakingInterface>(
        selectedTezosAddress,
        contractAddress,
        lastItem?.level
      );
    }

    const tezos = createReadOnlyTezosToolkit(getAccountForTezos(selectedAccount));
    const contract = await tezos.contract.at(contractAddress);
    const tokenType = getTokenStandard(contract);

    if (tokenType === TokenStandardsEnum.Fa12) {
      return getTokenFa12Operations(selectedTezosAddress, contractAddress, lastItem?.level);
    }

    if (tokenType === TokenStandardsEnum.Fa2) {
      return getTokenFa2Operations(selectedTezosAddress, contractAddress, tokenId, lastItem?.level);
    }
  }

  return getAllOperations(selectedTezosAddress, lastItem?.id);
};

export const loadActivity = async (
  /** @deprecated // Wanna pass PKH only */
  selectedAccount: Account,
  tokenSlug?: string,
  lastItem?: ActivityInterface
) => {
  const selectedTezosAddress = getAccountAddressForTezos(selectedAccount);

  if (!selectedTezosAddress) {
    return [];
  }

  const operationsHashes = await loadOperations(selectedAccount, tokenSlug, lastItem)
    .then(operations => operations.map(operation => operation.hash))
    .then(newHashes => uniq(newHashes.filter(x => x !== lastItem?.hash)));

  const operationGroups = [];

  for (const opHash of operationsHashes) {
    const { data } = await getOperationGroupByHash<OperationInterface>(opHash);
    operationGroups.push(data);
    await sleep(100);
  }

  return operationGroups.map(group => mapOperationsToActivities(selectedTezosAddress, group));
};
