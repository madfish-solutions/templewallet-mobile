import { TezosToolkit } from '@taquito/taquito';
import memoize from 'mem';
import {
  contracts,
  AssetDefinition,
  Storage,
  StorageKey,
  StorageKeyReturnType,
  createEngine,
  YouvesEngine
} from 'youves-sdk';
import { mainnetNetworkConstants, mainnetTokens } from 'youves-sdk/dist/networks.mainnet';
import { UnifiedSavings } from 'youves-sdk/dist/staking/savings-v3';
import { UnifiedStaking } from 'youves-sdk/dist/staking/unified-staking';
import { TokenType, Token as YouvesToken } from 'youves-sdk/dist/tokens/token';

import { EarnOpportunityTokenStandardEnum } from 'src/enums/earn-opportunity-token-standard.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { isDefined } from 'src/utils/is-defined';
import { getFastRpcClient } from 'src/utils/rpc/fast-rpc';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';

import { INDEXER_CONFIG, MAINNET_SMARTPY_RPC, YOUVES_TOKENS_ICONS } from './constants';
import { YouvesTokensEnum } from './enums';
import { CacheStorageType } from './types';

const youvesTokensIds: string[] = [YouvesTokensEnum.UBTC, YouvesTokensEnum.UUSD];

export const youvesTokensRecord = Object.values(contracts.mainnet)
  .filter(token => youvesTokensIds.includes(token.id))
  .reduce(
    (acc: Record<string, AssetDefinition>, token) => ({
      ...acc,
      [token.id]: token
    }),
    {}
  );

export const fallbackTezosToolkit = new TezosToolkit(getFastRpcClient(MAINNET_SMARTPY_RPC));

class MemoryStorage implements Storage {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public storage: Map<string, any>;

  constructor() {
    this.storage = new Map();
  }
  public async set<K extends StorageKey>(key: K, value: StorageKeyReturnType[K]): Promise<void> {
    this.storage.set(key, value);
  }
  public async get<K extends StorageKey>(key: K): Promise<StorageKeyReturnType[K]> {
    return this.storage.get(key);
  }
  public async delete<K extends StorageKey>(key: K): Promise<void> {
    this.storage.delete(key);
  }
  public async clear() {
    this.storage.clear();
  }
}

const getTezosToolkit = (account?: AccountInterface) =>
  isDefined(account) ? createReadOnlyTezosToolkit(MAINNET_SMARTPY_RPC, account) : fallbackTezosToolkit;

class MemoizeControllableCache<A extends unknown[], V> {
  private readonly cache: Map<string, CacheStorageType<V>>;

  constructor(private cacheFn: (...args: A) => string) {
    this.cache = new Map();
  }

  public has(key: string) {
    return this.cache.has(key);
  }
  public get(key: string) {
    return this.cache.get(key);
  }
  public set(key: string, value: CacheStorageType<V>) {
    this.cache.set(key, value);
  }
  public delete(key: string) {
    this.cache.delete(key);
  }
  public deleteByArgs(...args: A) {
    this.delete(this.cacheFn(...args));
  }
  public clear() {
    this.cache.clear();
  }
}

const getCreateEngineCacheKey = (token: AssetDefinition, account?: AccountInterface) =>
  [token.id, account?.publicKey, account?.publicKeyHash].join('_');
export const createEngineCache = new MemoizeControllableCache<
  [AssetDefinition, AccountInterface | undefined],
  YouvesEngine
>(getCreateEngineCacheKey);
export const createEngineMemoized = memoize(
  (token: AssetDefinition, account?: AccountInterface) =>
    createEngine({
      tezos: getTezosToolkit(account),
      contracts: token,
      storage: new MemoryStorage(),
      indexerConfig: INDEXER_CONFIG,
      tokens: mainnetTokens,
      activeCollateral: contracts.mainnet[0].collateralOptions[0],
      networkConstants: mainnetNetworkConstants
    }),
  {
    cacheKey: ([token, account]) => getCreateEngineCacheKey(token, account),
    cache: createEngineCache
  }
);

const getCreateUnifiedSavingsCacheKey = (
  { SAVINGS_V3_POOL_ADDRESS, token }: AssetDefinition,
  account: AccountInterface
) => [SAVINGS_V3_POOL_ADDRESS, token.id, account.publicKey, account.publicKeyHash].join('_');
export const createUnifiedSavingsCache = new MemoizeControllableCache<
  [AssetDefinition, AccountInterface],
  UnifiedSavings
>(getCreateUnifiedSavingsCacheKey);
export const createUnifiedSavings = memoize(
  (assetDefinition: AssetDefinition, account: AccountInterface) =>
    new UnifiedSavings(
      assetDefinition.SAVINGS_V3_POOL_ADDRESS,
      assetDefinition.token,
      assetDefinition.token,
      createReadOnlyTezosToolkit(MAINNET_SMARTPY_RPC, account),
      INDEXER_CONFIG,
      mainnetNetworkConstants
    ),
  {
    cacheKey: ([assetDefinition, account]) => getCreateUnifiedSavingsCacheKey(assetDefinition, account),
    cache: createUnifiedSavingsCache
  }
);

const getCreateUnifiedStakingCacheKey = (account?: AccountInterface) =>
  [account?.publicKey, account?.publicKeyHash].join('_');
export const createUnifiedStakingCache = new MemoizeControllableCache<[AccountInterface | undefined], UnifiedStaking>(
  getCreateUnifiedStakingCacheKey
);
export const createUnifiedStaking = memoize(
  (account?: AccountInterface) => new UnifiedStaking(getTezosToolkit(account), INDEXER_CONFIG, mainnetNetworkConstants),
  { cacheKey: ([account]) => getCreateUnifiedStakingCacheKey(account), cache: createUnifiedStakingCache }
);

export const toEarnOpportunityToken = (token: YouvesToken) => {
  const {
    decimals: tokenDecimals,
    name: tokenName,
    symbol: tokenSymbol,
    contractAddress: tokenAddress,
    type: tokenType,
    tokenId
  } = token;

  return {
    contractAddress: tokenAddress,
    fa2TokenId: tokenId,
    type: tokenType === TokenType.FA2 ? EarnOpportunityTokenStandardEnum.Fa2 : EarnOpportunityTokenStandardEnum.Fa12,
    isWhitelisted: true,
    metadata: {
      decimals: tokenDecimals,
      symbol: tokenSymbol,
      name: tokenName,
      thumbnailUri: YOUVES_TOKENS_ICONS[tokenId]
    }
  };
};
