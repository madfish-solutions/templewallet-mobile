import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { catchError, from, map, Observable, of } from 'rxjs';
import { contracts, AssetDefinition, createEngine, Storage, StorageKey, StorageKeyReturnType } from 'youves-sdk';
import { UnifiedStaking } from 'youves-sdk/src/staking/unified-staking';

import { getFastRpcClient } from '../../utils/rpc/fast-rpc';
import { INITIAL_ARP_VALUE, MAINNET_SMARTPY_RPC, YOUVES_INDEXER_URL } from './constants';
import { mainnetNetworkConstants } from './mock/mainnet-network-constants';
import { mainnetTokens } from './mock/mainnet-networks';

const toolkit = new TezosToolkit(getFastRpcClient(MAINNET_SMARTPY_RPC));
const indexerConfig = { url: YOUVES_INDEXER_URL, headCheckUrl: '' };
const MULTIPLIER = 100;

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

export const getYOUTokenApr$ = (
  assetToUsdExchangeRate: BigNumber,
  governanceToUsdExchangeRate: BigNumber
): Observable<number> => {
  const unifiedStaking = new UnifiedStaking(toolkit, indexerConfig, mainnetNetworkConstants);

  return from(unifiedStaking.getAPR(assetToUsdExchangeRate, governanceToUsdExchangeRate)).pipe(
    map(value => Number(value.multipliedBy(MULTIPLIER))),
    catchError(() => of(INITIAL_ARP_VALUE))
  );
};

export const getYouvesTokenApr$ = (token: AssetDefinition): Observable<number> => {
  const youves = createEngine({
    tezos: toolkit,
    contracts: token,
    storage: new MemoryStorage(),
    indexerConfig,
    tokens: mainnetTokens,
    activeCollateral: contracts.mainnet[0].collateralOptions[0],
    networkConstants: mainnetNetworkConstants
  });

  return from(youves.getSavingsPoolV3YearlyInterestRate()).pipe(
    map(value => Number(value.multipliedBy(MULTIPLIER))),
    catchError(() => of(INITIAL_ARP_VALUE))
  );
};
