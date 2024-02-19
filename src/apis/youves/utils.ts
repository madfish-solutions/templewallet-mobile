import { TezosToolkit } from '@taquito/taquito';
import { createEngine } from '@temple-wallet/youves-sdk/dist/engines/createEngine';
import { YouvesEngine } from '@temple-wallet/youves-sdk/dist/engines/YouvesEngine';
import { contracts } from '@temple-wallet/youves-sdk/dist/networks';
import { AssetDefinition } from '@temple-wallet/youves-sdk/dist/networks.base';
import { mainnetNetworkConstants, mainnetTokens } from '@temple-wallet/youves-sdk/dist/networks.mainnet';
import { UnifiedSavings } from '@temple-wallet/youves-sdk/dist/staking/savings-v3';
import { UnifiedStaking } from '@temple-wallet/youves-sdk/dist/staking/unified-staking';
import { Storage } from '@temple-wallet/youves-sdk/dist/storage/Storage';
import { StorageKey, StorageKeyReturnType } from '@temple-wallet/youves-sdk/dist/storage/types';
import { TokenType, Token as YouvesToken } from '@temple-wallet/youves-sdk/dist/tokens/token';
import memoize from 'mem';

import { EarnOpportunityTokenStandardEnum } from 'src/enums/earn-opportunity-token-standard.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { isDefined } from 'src/utils/is-defined';
import { getFastRpcClient } from 'src/utils/rpc/fast-rpc';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';

import { INDEXER_CONFIG, YOUVES_TOKENS_ICONS } from './constants';
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

export const getTezosToolkit = memoize(
  (rpcUrl: string, account?: AccountInterface) =>
    isDefined(account) ? createReadOnlyTezosToolkit(rpcUrl, account) : new TezosToolkit(getFastRpcClient(rpcUrl)),
  { cacheKey: ([rpcUrl, account]) => [rpcUrl, account?.publicKey].join('_') }
);

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

const getCreateEngineCacheKey = (rpcUrl: string, token: AssetDefinition, account?: AccountInterface) =>
  [rpcUrl, token.id, account?.publicKey].join('_');
export const createEngineCache = new MemoizeControllableCache<
  [string, AssetDefinition, AccountInterface | undefined],
  YouvesEngine
>(getCreateEngineCacheKey);
export const createEngineMemoized = memoize(
  (rpcUrl: string, token: AssetDefinition, account?: AccountInterface) =>
    createEngine({
      tezos: getTezosToolkit(rpcUrl, account),
      contracts: token,
      storage: new MemoryStorage(),
      indexerConfig: INDEXER_CONFIG,
      tokens: mainnetTokens,
      activeCollateral: contracts.mainnet[0].collateralOptions[0],
      networkConstants: mainnetNetworkConstants
    }),
  {
    cacheKey: ([rpcUrl, token, account]) => getCreateEngineCacheKey(rpcUrl, token, account),
    cache: createEngineCache
  }
);

const getCreateUnifiedSavingsCacheKey = (
  rpcUrl: string,
  { SAVINGS_V3_POOL_ADDRESS, token }: AssetDefinition,
  account: AccountInterface
) => [rpcUrl, SAVINGS_V3_POOL_ADDRESS, token.id, account.publicKey].join('_');
export const createUnifiedSavingsCache = new MemoizeControllableCache<
  [string, AssetDefinition, AccountInterface],
  UnifiedSavings
>(getCreateUnifiedSavingsCacheKey);
export const createUnifiedSavings = memoize(
  (rpcUrl: string, assetDefinition: AssetDefinition, account: AccountInterface) =>
    new UnifiedSavings(
      assetDefinition.SAVINGS_V3_POOL_ADDRESS,
      assetDefinition.token,
      assetDefinition.token,
      createReadOnlyTezosToolkit(rpcUrl, account),
      INDEXER_CONFIG,
      mainnetNetworkConstants
    ),
  {
    cacheKey: ([rpcUrl, assetDefinition, account]) => getCreateUnifiedSavingsCacheKey(rpcUrl, assetDefinition, account),
    cache: createUnifiedSavingsCache
  }
);

const getCreateUnifiedStakingCacheKey = (rpcUrl: string, account?: AccountInterface) =>
  [rpcUrl, account?.publicKey].join('_');
export const createUnifiedStakingCache = new MemoizeControllableCache<
  [string, AccountInterface | undefined],
  UnifiedStaking
>(getCreateUnifiedStakingCacheKey);
export const createUnifiedStaking = memoize(
  (rpcUrl: string, account?: AccountInterface) =>
    new UnifiedStaking(getTezosToolkit(rpcUrl, account), INDEXER_CONFIG, mainnetNetworkConstants),
  {
    cacheKey: ([rpcUrl, account]) => getCreateUnifiedStakingCacheKey(rpcUrl, account),
    cache: createUnifiedStakingCache
  }
);

export const toEarnOpportunityToken = (token: YouvesToken) => {
  const {
    decimals: tokenDecimals,
    name: tokenName,
    symbol: tokenSymbol,
    contractAddress: tokenAddress,
    type: tokenType,
    tokenId,
    id
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
      thumbnailUri: YOUVES_TOKENS_ICONS[id]
    }
  };
};
