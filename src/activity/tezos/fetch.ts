import { uniq } from 'lodash-es';

import * as TZKT from 'src/apis/tzkt';
import type { TzktOperation } from 'src/apis/tzkt/types';
import { refetchOnce429 } from 'src/apis/utils';
import { LIQUIDITY_BAKING_DEX_ADDRESS } from 'src/token/data/token-slugs';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TezosTokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { getTokenStandard } from 'src/token/utils/token.utils';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';

import { isKnownTzktStatus } from './pre-parse';
import type { TempleTzktOperationsGroup, TezosActivityOlderThan } from './types';

export interface TezosOperationsPage {
  operations: TzktOperation[];
  oldestRawOperation: TzktOperation | undefined;
}

const toOperationsPage = (rawOperations: TzktOperation[]): TezosOperationsPage => ({
  operations: rawOperations,
  oldestRawOperation: rawOperations.at(-1)
});

/** `pseudoLimit`: the API can return fewer operations than this, even when older items exist */
export async function fetchOperations(
  accountAddress: string,
  assetSlug: string | undefined,
  pseudoLimit: number,
  olderThan?: TezosActivityOlderThan,
  signal?: AbortSignal
): Promise<TezosOperationsPage> {
  if (assetSlug) {
    const [contractAddress, tokenId] = assetSlug.split('_');

    if (assetSlug === TEZ_TOKEN_SLUG) {
      return fetchOperations_TEZ(accountAddress, pseudoLimit, olderThan, signal);
    }

    if (contractAddress === LIQUIDITY_BAKING_DEX_ADDRESS) {
      return fetchOperations_Contract(accountAddress, contractAddress, pseudoLimit, olderThan, signal);
    }

    const tezos = createReadOnlyTezosToolkit();
    const contract = await tezos.contract.at(contractAddress);

    return getTokenStandard(contract) === TezosTokenStandardsEnum.Fa12
      ? fetchOperations_Token_Fa_1_2(accountAddress, contractAddress, pseudoLimit, olderThan, signal)
      : fetchOperations_Token_Fa_2(accountAddress, contractAddress, tokenId, pseudoLimit, olderThan, signal);
  }

  return fetchOperations_Any(accountAddress, pseudoLimit, olderThan, signal);
}

const fetchOperations_TEZ = async (
  accountAddress: string,
  pseudoLimit: number,
  olderThan?: TezosActivityOlderThan,
  signal?: AbortSignal
) =>
  toOperationsPage(
    await TZKT.fetchGetOperationsTransactions(
      {
        'anyof.sender.target.initiator': accountAddress,
        ...buildOlderThanIdParam(olderThan),
        limit: pseudoLimit,
        'sort.desc': 'id',
        'amount.ne': '0'
      },
      signal
    )
  );

const fetchOperations_Contract = async (
  accountAddress: string,
  contractAddress: string,
  pseudoLimit: number,
  olderThan?: TezosActivityOlderThan,
  signal?: AbortSignal
) =>
  toOperationsPage(
    await TZKT.fetchGetOperationsTransactions(
      {
        target: contractAddress,
        initiator: accountAddress,
        limit: pseudoLimit,
        entrypoint: 'mintOrBurn',
        'sort.desc': 'id',
        ...buildOlderThanIdParam(olderThan)
      },
      signal
    )
  );

const fetchOperations_Token_Fa_1_2 = async (
  accountAddress: string,
  contractAddress: string,
  pseudoLimit: number,
  olderThan?: TezosActivityOlderThan,
  signal?: AbortSignal
) =>
  toOperationsPage(
    await TZKT.fetchGetOperationsTransactions(
      {
        limit: pseudoLimit,
        entrypoint: 'transfer',
        'sort.desc': 'id',
        target: contractAddress,
        'parameter.in': `[{"from":"${accountAddress}"},{"to":"${accountAddress}"}]`,
        ...buildOlderThanIdParam(olderThan)
      },
      signal
    )
  );

const fetchOperations_Token_Fa_2 = async (
  accountAddress: string,
  contractAddress: string,
  tokenId = '0',
  pseudoLimit: number,
  olderThan?: TezosActivityOlderThan,
  signal?: AbortSignal
) =>
  toOperationsPage(
    await TZKT.fetchGetOperationsTransactions(
      {
        limit: pseudoLimit,
        entrypoint: 'transfer',
        'sort.desc': 'id',
        target: contractAddress,
        'parameter.[*].in': JSON.stringify([
          { from_: accountAddress, txs: [{ token_id: tokenId }] },
          { txs: [{ to_: accountAddress, token_id: tokenId }] }
        ]),
        ...buildOlderThanIdParam(olderThan)
      },
      signal
    )
  );

async function fetchOperations_Any(
  accountAddress: string,
  pseudoLimit: number,
  olderThan?: TezosActivityOlderThan,
  signal?: AbortSignal
) {
  const limit = pseudoLimit;

  const accOperations = await TZKT.fetchGetAccountOperations(
    accountAddress,
    {
      types: ['delegation', 'origination', 'transaction'],
      lastId: olderThan?.oldestTzktOperation.id,
      limit,
      sort: 1
    },
    signal
  );

  const newerThen = accOperations.at(-1)?.timestamp;
  const endLimitation = newerThen ? { newerThen } : { limit };

  const fa12OperationsTransactions = await refetchOnce429(
    () => fetchIncomingOperTransactions_Fa_1_2(accountAddress, endLimitation, olderThan, signal),
    1000
  );

  const fa2OperationsTransactions = await refetchOnce429(
    () => fetchIncomingOperTransactions_Fa_2(accountAddress, endLimitation, olderThan, signal),
    1000
  );

  const allOperations = accOperations
    .concat(fa12OperationsTransactions, fa2OperationsTransactions)
    .sort((b, a) => a.id - b.id);

  return toOperationsPage(allOperations);
}

type EndLimitation = { limit: number } | { newerThen: string };

const buildBottomParams = (endLimitation: EndLimitation) =>
  'limit' in endLimitation ? endLimitation : { 'timestamp.ge': endLimitation.newerThen };

function fetchIncomingOperTransactions_Fa_1_2(
  accountAddress: string,
  endLimitation: EndLimitation,
  olderThan?: TezosActivityOlderThan,
  signal?: AbortSignal
) {
  return TZKT.fetchGetOperationsTransactions(
    {
      'sender.ne': accountAddress,
      'target.ne': accountAddress,
      'initiator.ne': accountAddress,
      'parameter.to': accountAddress,
      entrypoint: 'transfer',
      ...buildOlderThanIdParam(olderThan),
      ...buildBottomParams(endLimitation),
      'sort.desc': 'id'
    },
    signal
  );
}

function fetchIncomingOperTransactions_Fa_2(
  accountAddress: string,
  endLimitation: EndLimitation,
  olderThan?: TezosActivityOlderThan,
  signal?: AbortSignal
) {
  return TZKT.fetchGetOperationsTransactions(
    {
      'sender.ne': accountAddress,
      'target.ne': accountAddress,
      'initiator.ne': accountAddress,
      'parameter.[*].txs.[*].to_': accountAddress,
      entrypoint: 'transfer',
      ...buildOlderThanIdParam(olderThan),
      ...buildBottomParams(endLimitation),
      'sort.desc': 'id'
    },
    signal
  );
}

const MAX_CACHED_OPERATION_GROUPS = 500;

// A group whose operations all reached a final status never changes, so re-opens skip its by-hash refetch
const operationGroupsCache = new Map<string, TzktOperation[]>();

export async function fetchOperGroupsForOperations(
  hashes: string[],
  olderThan?: TezosActivityOlderThan,
  signal?: AbortSignal
) {
  const uniqueHashes = uniq(hashes);

  if (olderThan && uniqueHashes.at(0) === olderThan.hash) uniqueHashes.splice(0, 1);

  const groups: TempleTzktOperationsGroup[] = [];

  for (const hash of uniqueHashes) {
    const cachedOperations = operationGroupsCache.get(hash);

    if (cachedOperations) {
      groups.push({ hash, operations: cachedOperations });
      continue;
    }

    const operations = await refetchOnce429(() => TZKT.fetchGetOperationsByHash(hash, signal), 1000);

    groups.push({ hash, operations });

    if (operations.length > 0 && operations.every(({ status }) => isKnownTzktStatus(status))) {
      operationGroupsCache.set(hash, operations);

      while (operationGroupsCache.size > MAX_CACHED_OPERATION_GROUPS) {
        const oldestKey = operationGroupsCache.keys().next().value;

        if (oldestKey === undefined) {
          break;
        }

        operationGroupsCache.delete(oldestKey);
      }
    }
  }

  return groups;
}

// Id-based cursor (not timestamp): when one block has more of the account's operations than the page
// limit, `timestamp.lt` skips the rest of that block and `timestamp.le` loads the same page forever
const buildOlderThanIdParam = (olderThan?: TezosActivityOlderThan) => ({
  'id.lt': olderThan?.oldestTzktOperation.id
});
