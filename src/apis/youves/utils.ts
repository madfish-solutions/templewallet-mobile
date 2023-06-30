import { TezosToolkit } from '@taquito/taquito';
import memoize from 'mem';
import { contracts, AssetDefinition, Storage, StorageKey, StorageKeyReturnType, createEngine } from 'youves-sdk';
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
  { cacheKey: ([token, account]) => [token.id, account?.publicKey, account?.publicKeyHash].join('_') }
);

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
    cacheKey: ([{ SAVINGS_V3_POOL_ADDRESS, token }, account]) =>
      [SAVINGS_V3_POOL_ADDRESS, token.id, account.publicKey, account.publicKeyHash].join('_')
  }
);

export const createUnifiedStaking = memoize(
  (account?: AccountInterface) => new UnifiedStaking(getTezosToolkit(account), INDEXER_CONFIG, mainnetNetworkConstants),
  { cacheKey: ([account]) => `${account?.publicKey}_${account?.publicKeyHash}` }
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
