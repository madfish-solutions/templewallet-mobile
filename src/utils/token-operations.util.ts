import { Activity, TzktMemberInterface, TzktOperation, parseTransactions } from '@temple-wallet/transactions-parser';
import { LiquidityBakingMintOrBurnInterface } from '@temple-wallet/transactions-parser/dist/types/liquidity-baking';
import { Fa12TransferInterface, Fa2TransferInterface } from '@temple-wallet/transactions-parser/dist/types/transfers';
import { isEmpty, uniq } from 'lodash-es';

import { getTzktApi } from '../api.service';
import { OPERATION_LIMIT } from '../config/general';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { AccountInterface } from '../interfaces/account.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { LIQUIDITY_BAKING_DEX_ADDRESS } from '../token/data/token-slugs';
import { TEZ_TOKEN_SLUG } from '../token/data/tokens-metadata';
import { getTokenType } from '../token/utils/token.utils';
import { isDefined } from './is-defined';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';
import { sleep } from './timeouts.util';

const getOperationGroupByHash = <T>(selectedRpcUrl: string, hash: string) =>
  getTzktApi(selectedRpcUrl).get<Array<T>>(`operations/${hash}`);

// LIQUIDITY BAKING ACTIVITY
const getContractOperations = <T>(
  selectedRpcUrl: string,
  account: string,
  contractAddress: string,
  lastTimestamp?: string
) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<T>>(`accounts/${contractAddress}/operations`, {
      params: {
        type: 'transaction',
        limit: OPERATION_LIMIT,
        sort: '1',
        initiator: account,
        entrypoint: 'mintOrBurn',
        ...(isDefined(lastTimestamp) ? { 'timestamp.lt': lastTimestamp } : undefined)
      }
    })
    .then(x => x.data);

const getTokenFa2Operations = (
  selectedRpcUrl: string,
  account: string,
  contractAddress: string,
  tokenId = '0',
  lastTimestamp?: string
) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<Fa2TransferInterface>>('operations/transactions', {
      params: {
        limit: OPERATION_LIMIT,
        entrypoint: 'transfer',
        'sort.desc': 'level',
        target: contractAddress,
        'parameter.[*].in': `[{"from_":"${account}","txs":[{"token_id":"${tokenId}"}]},{"txs":[{"to_":"${account}","token_id":"${tokenId}"}]}]`,
        ...(isDefined(lastTimestamp) ? { 'timestamp.lt': lastTimestamp } : undefined)
      }
    })
    .then(x => x.data);

const getTokenFa12Operations = (
  selectedRpcUrl: string,
  account: string,
  contractAddress: string,
  lastTimestamp?: string
) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<Fa12TransferInterface>>('operations/transactions', {
      params: {
        limit: OPERATION_LIMIT,
        entrypoint: 'transfer',
        'sort.desc': 'level',
        target: contractAddress,
        'parameter.in': `[{"from":"${account}"},{"to":"${account}"}]`,
        ...(isDefined(lastTimestamp) ? { 'timestamp.lt': lastTimestamp } : undefined)
      }
    })
    .then(x => x.data);

const getTezosOperations = (selectedRpcUrl: string, account: string, lastId?: number) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<TzktOperation>>(`accounts/${account}/operations`, {
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
    .get<Array<TzktOperation>>(`accounts/${account}/operations`, {
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
    .get<Array<Fa12TransferInterface>>('operations/transactions', {
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
    .get<Array<Fa2TransferInterface>>('operations/transactions', {
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
): Promise<TzktOperation[]> => {
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
  lastItem?: Activity
): Promise<Array<TzktOperation>> => {
  const [contractAddress, tokenId] = (tokenSlug ?? '').split('_');

  if (isDefined(tokenSlug)) {
    if (tokenSlug === TEZ_TOKEN_SLUG) {
      return getTezosOperations(selectedRpcUrl, selectedAccount.publicKeyHash, lastItem?.id);
    }

    if (tokenSlug === LIQUIDITY_BAKING_DEX_ADDRESS) {
      return getContractOperations<LiquidityBakingMintOrBurnInterface>(
        selectedRpcUrl,
        selectedAccount.publicKeyHash,
        contractAddress,
        lastItem?.timestamp
      );
    }

    const tezos = createReadOnlyTezosToolkit(selectedRpcUrl, selectedAccount);
    const contract = await tezos.contract.at(contractAddress);
    const tokenType = getTokenType(contract);

    if (tokenType === TokenTypeEnum.FA_1_2) {
      return getTokenFa12Operations(
        selectedRpcUrl,
        selectedAccount.publicKeyHash,
        contractAddress,
        lastItem?.timestamp
      );
    }

    if (tokenType === TokenTypeEnum.FA_2) {
      return getTokenFa2Operations(
        selectedRpcUrl,
        selectedAccount.publicKeyHash,
        contractAddress,
        tokenId,
        lastItem?.timestamp
      );
    }
  }

  return getAllOperations(selectedRpcUrl, selectedAccount.publicKeyHash, lastItem?.id);
};

export const loadActivity = async (
  selectedRpcUrl: string,
  selectedAccount: AccountInterface,
  tokenSlug?: string,
  knownBakers?: Array<TzktMemberInterface>,
  lastItem?: Activity
): Promise<Array<Array<Activity>>> => {
  const operationsHashes = await loadOperations(selectedRpcUrl, selectedAccount, tokenSlug, lastItem)
    .then(operations => operations.map(operation => operation.hash))
    .then(newHashes => uniq(newHashes.filter(x => x !== lastItem?.hash)));

  const operationGroups: Array<Array<TzktOperation>> = [];

  for (const opHash of operationsHashes) {
    const { data } = await getOperationGroupByHash<TzktOperation>(selectedRpcUrl, opHash);
    operationGroups.push(data);
    await sleep(100);
  }

  return operationGroups
    .map(group => parseTransactions(group, selectedAccount.publicKeyHash, knownBakers))
    .filter(group => !isEmpty(group));
};
