import {
  Activity,
  TzktMemberInterface,
  TzktOperation,
  parseOperations,
  TzktTokenTransfer,
  TzktOperationType
} from '@temple-wallet/transactions-parser';
import { LiquidityBakingMintOrBurnInterface } from '@temple-wallet/transactions-parser/dist/types/liquidity-baking';
import { Fa12TransferInterface, Fa2TransferInterface } from '@temple-wallet/transactions-parser/dist/types/transfers';
import { AxiosError } from 'axios';
import { isEmpty, uniq } from 'lodash-es';
import { stringify } from 'qs';

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

const TZKT_FETCH_QUERY_SIZE = 10000;

interface OperationsGroup {
  hash: string;
  operations: TzktOperation[];
  tokensTransfers: TzktTokenTransfer[];
}

interface LoadActivityReturnValue {
  activities: Activity[][];
  reachedTheEnd: boolean;
  oldestOperation?: TzktOperation;
}

const getOperationGroupByHash = (selectedRpcUrl: string, hash: string) =>
  getTzktApi(selectedRpcUrl)
    .get<TzktOperation[]>(`operations/${hash}`)
    .then(x => x.data);

const getTokensTransfersByTxIds = async (
  selectedRpcUrl: string,
  transactionsIds: number[],
  lastId?: number
): Promise<TzktTokenTransfer[]> => {
  if (transactionsIds.length === 0) {
    return [];
  }

  const newTransfers = await getTzktApi(selectedRpcUrl)
    .get<TzktTokenTransfer[]>('/tokens/transfers', {
      params: {
        'transactionId.in': transactionsIds.join(','),
        limit: TZKT_FETCH_QUERY_SIZE,
        select: 'id,from,to,transactionId,amount,token.contract,token.tokenId',
        'sort.desc': 'id',
        ...(isDefined(lastId) ? { 'id.lt': lastId } : {})
      }
    })
    .then(x => x.data);

  if (newTransfers.length < TZKT_FETCH_QUERY_SIZE) {
    return newTransfers;
  }

  return newTransfers.concat(
    await getTokensTransfersByTxIds(selectedRpcUrl, transactionsIds, newTransfers[newTransfers.length - 1].id)
  );
};

// LIQUIDITY BAKING ACTIVITY
const getContractOperations = <T>(selectedRpcUrl: string, account: string, contractAddress: string, lastId?: number) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<T>>(`accounts/${contractAddress}/operations`, {
      params: {
        type: 'transaction',
        limit: OPERATION_LIMIT,
        sort: '1',
        initiator: account,
        entrypoint: 'mintOrBurn',
        ...(isDefined(lastId) ? { lastId } : undefined)
      }
    })
    .then(x => x.data);

const getTokenFa2Operations = (
  selectedRpcUrl: string,
  account: string,
  contractAddress: string,
  tokenId = '0',
  lastId?: number
) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<Fa2TransferInterface>>('operations/transactions', {
      paramsSerializer: stringify,
      params: {
        limit: OPERATION_LIMIT,
        entrypoint: 'transfer',
        'sort.desc': 'level',
        target: contractAddress,
        'parameter.[*].in': `[{"from_":"${account}","txs":[{"token_id":"${tokenId}"}]},{"txs":[{"to_":"${account}","token_id":"${tokenId}"}]}]`,
        ...(isDefined(lastId) ? { 'id.lt': lastId } : undefined)
      }
    })
    .then(x => x.data);

const getTokenFa12Operations = (selectedRpcUrl: string, account: string, contractAddress: string, lastId?: number) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<Fa12TransferInterface>>('operations/transactions', {
      paramsSerializer: stringify,
      params: {
        limit: OPERATION_LIMIT,
        entrypoint: 'transfer',
        'sort.desc': 'level',
        target: contractAddress,
        'parameter.in': `[{"from":"${account}"},{"to":"${account}"}]`,
        ...(isDefined(lastId) ? { 'id.lt': lastId } : undefined)
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

  const operationsFa12 = await refetchOnce429(() =>
    getFa12IncomingOperations(selectedRpcUrl, publicKeyHash, lowerId, upperId)
  );
  const operationsFa2 = await refetchOnce429(() =>
    getFa2IncomingOperations(selectedRpcUrl, publicKeyHash, lowerId, upperId)
  );

  return operations
    .concat(operationsFa12)
    .concat(operationsFa2)
    .sort((b, a) => a.id - b.id);
};

const loadOperations = async (
  selectedRpcUrl: string,
  selectedAccount: AccountInterface,
  tokenSlug?: string,
  oldestOperation?: TzktOperation
) => {
  const [contractAddress, tokenId] = (tokenSlug ?? '').split('_');

  if (isDefined(tokenSlug)) {
    if (tokenSlug === TEZ_TOKEN_SLUG) {
      return getTezosOperations(selectedRpcUrl, selectedAccount.publicKeyHash, oldestOperation?.id);
    }

    if (tokenSlug === LIQUIDITY_BAKING_DEX_ADDRESS) {
      return getContractOperations<LiquidityBakingMintOrBurnInterface>(
        selectedRpcUrl,
        selectedAccount.publicKeyHash,
        contractAddress,
        oldestOperation?.id
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
        oldestOperation?.id
      );
    }

    if (tokenType === TokenTypeEnum.FA_2) {
      return getTokenFa2Operations(
        selectedRpcUrl,
        selectedAccount.publicKeyHash,
        contractAddress,
        tokenId,
        oldestOperation?.id
      );
    }
  }

  return getAllOperations(selectedRpcUrl, selectedAccount.publicKeyHash, oldestOperation?.id);
};

const fetchOperGroupsForOperations = async (
  selectedRpcUrl: string,
  operations: TzktOperation[]
): Promise<OperationsGroup[]> => {
  const uniqueHashes = uniq(operations.map(d => d.hash));

  const groups: OperationsGroup[] = [];

  for (const hash of uniqueHashes) {
    const operations = await refetchOnce429(() => getOperationGroupByHash(selectedRpcUrl, hash));
    const tokensTransfers = await refetchOnce429(() =>
      getTokensTransfersByTxIds(
        selectedRpcUrl,
        operations
          .filter(op => op.type === TzktOperationType.Transaction && (op.tokenTransfersCount ?? 0) > 0)
          .map(({ id }) => id)
      )
    );
    operations.sort((b, a) => a.id - b.id);

    groups.push({
      hash,
      operations,
      tokensTransfers
    });
  }

  return groups;
};

export const loadActivity = async (
  selectedRpcUrl: string,
  selectedAccount: AccountInterface,
  tokenSlug?: string,
  knownBakers?: Array<TzktMemberInterface>,
  oldestOperation?: TzktOperation
): Promise<LoadActivityReturnValue> => {
  const operations = await loadOperations(selectedRpcUrl, selectedAccount, tokenSlug, oldestOperation);

  const groups = await fetchOperGroupsForOperations(selectedRpcUrl, operations);

  const reachedTheEnd = groups.length === 0;

  if (reachedTheEnd) {
    return { activities: [], reachedTheEnd };
  }

  const lastGroup = groups[groups.length - 1];
  const oldestOperationNew = lastGroup.operations[lastGroup.operations.length - 1];

  const activities = groups
    .map(({ operations, tokensTransfers }) =>
      parseOperations(operations, selectedAccount.publicKeyHash, knownBakers, tokensTransfers)
    )
    .filter(group => !isEmpty(group));

  if (activities.length === 0) {
    return loadActivity(selectedRpcUrl, selectedAccount, tokenSlug, knownBakers, oldestOperationNew);
  }

  return { activities, reachedTheEnd, oldestOperation: oldestOperationNew };
};

const refetchOnce429 = async <R>(fetcher: () => Promise<R>, delayAroundInMS = 1000) => {
  try {
    return await fetcher();
  } catch (err: any) {
    if (err.isAxiosError) {
      const error: AxiosError = err;
      if (error.response?.status === 429) {
        await sleep(delayAroundInMS);
        const res = await fetcher();
        await sleep(delayAroundInMS);

        return res;
      }
    }

    throw err;
  }
};
