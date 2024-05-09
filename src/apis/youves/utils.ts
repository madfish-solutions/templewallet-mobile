import { TezosToolkit } from '@taquito/taquito';
import {
  createEngine,
  contracts,
  AssetDefinition,
  mainnetNetworkConstants,
  mainnetTokens,
  UnifiedSavings,
  UnifiedStaking,
  Storage,
  StorageKey,
  StorageKeyReturnType,
  TokenType,
  Token as YouvesToken
} from '@temple-wallet/youves-sdk';
import memoize from 'memoizee';

import { EarnOpportunityTokenStandardEnum } from 'src/enums/earn-opportunity-token-standard.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { isDefined } from 'src/utils/is-defined';
import { getFastRpcClient } from 'src/utils/rpc/fast-rpc';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';

import { INDEXER_CONFIG, YOUVES_TOKENS_ICONS } from './constants';
import { YouvesTokensEnum } from './enums';

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

const getTezosToolkit = memoize(
  (rpcUrl: string, account?: AccountInterface) =>
    isDefined(account) ? createReadOnlyTezosToolkit(rpcUrl, account) : new TezosToolkit(getFastRpcClient(rpcUrl)),
  { normalizer: ([rpcUrl, account]) => [rpcUrl, account?.publicKey].join('_') }
);

const getCreateEngineCacheKey = (rpcUrl: string, token: AssetDefinition, account?: AccountInterface) =>
  [rpcUrl, token.id, account?.publicKey].join('_');

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
    normalizer: ([rpcUrl, token, account]) => getCreateEngineCacheKey(rpcUrl, token, account)
  }
);

const getCreateUnifiedSavingsCacheKey = (
  rpcUrl: string,
  { SAVINGS_V3_POOL_ADDRESS, token }: AssetDefinition,
  account: AccountInterface
) => [rpcUrl, SAVINGS_V3_POOL_ADDRESS, token.id, account.publicKey].join('_');

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
    normalizer: ([rpcUrl, assetDefinition, account]) =>
      getCreateUnifiedSavingsCacheKey(rpcUrl, assetDefinition, account)
  }
);

const getCreateUnifiedStakingCacheKey = (rpcUrl: string, account?: AccountInterface) =>
  [rpcUrl, account?.publicKey].join('_');

export const createUnifiedStaking = memoize(
  (rpcUrl: string, account?: AccountInterface) =>
    new UnifiedStaking(getTezosToolkit(rpcUrl, account), INDEXER_CONFIG, mainnetNetworkConstants),
  {
    normalizer: ([rpcUrl, account]) => getCreateUnifiedStakingCacheKey(rpcUrl, account)
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
