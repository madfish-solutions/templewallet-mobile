import AsyncStorage from '@react-native-async-storage/async-storage';
import { RpcClient } from '@taquito/rpc';
import memoize from 'memoizee';

import { isDefined } from '../is-defined';

interface RPCOptions {
  block: string;
}

class FastRpcClient extends RpcClient {
  refreshInterval = 10000; // 10 sec
  memoizeMaxAge = 180000; // 3 min

  private latestBlock?: {
    hash: string;
    refreshedAt: number; // timestamp
  };

  async getBlockHash(opts?: RPCOptions) {
    await this.loadLatestBlock(opts);

    if (wantsHead(opts) && this.latestBlock) {
      return this.latestBlock.hash;
    }

    return super.getBlockHash(opts);
  }

  async getBalance(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getBalanceMemo(address, opts);
  }

  getBalanceMemo = memoize(super.getBalance.bind(this), {
    normalizer: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getLiveBlocks(opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getLiveBlocksMemo(opts);
  }

  getLiveBlocksMemo = memoize(super.getLiveBlocks.bind(this), {
    normalizer: ([opts]) => toOptsKey(opts),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getStorage(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getStorageMemo(address, opts);
  }

  getStorageMemo = memoize(super.getStorage.bind(this), {
    normalizer: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getScript(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getScriptMemo(address, opts);
  }

  getScriptMemo = memoize(super.getScript.bind(this), {
    normalizer: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getContract(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getContractMemo(address, opts);
  }

  getContractMemo = memoize(super.getContract.bind(this), {
    normalizer: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getEntrypoints(contract: string, opts?: RPCOptions) {
    const cacheKey = `tez_entrypoints_${this.getRpcUrl()}_${contract}`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (isDefined(cached)) {
        return JSON.parse(cached);
      }
    } catch {}

    opts = await this.loadLatestBlock(opts);
    const result = await this.getEntrypointsMemo(contract, opts);
    await AsyncStorage.setItem(cacheKey, JSON.stringify(result));

    return result;
  }

  getEntrypointsMemo = memoize(super.getEntrypoints.bind(this), {
    normalizer: ([contract, opts]) => [contract, toOptsKey(opts)].join(''),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getManagerKey(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getManagerKeyMemo(address, opts);
  }

  getManagerKeyMemo = memoize(super.getManagerKey.bind(this), {
    normalizer: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getDelegate(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getDelegateMemo(address, opts);
  }

  getDelegateMemo = memoize(super.getDelegate.bind(this), {
    normalizer: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getBigMapExpr(id: string, expr: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getBigMapExprMemo(id, expr, opts);
  }

  getBigMapExprMemo = memoize(super.getBigMapExpr.bind(this), {
    normalizer: ([id, expr, opts]) => [id, expr, toOptsKey(opts)].join(''),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getDelegates(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getDelegatesMemo(address, opts);
  }

  getDelegatesMemo = memoize(super.getDelegates.bind(this), {
    normalizer: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getConstants(opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getConstantsMemo(opts);
  }

  getConstantsMemo = memoize(super.getConstants.bind(this), {
    normalizer: ([opts]) => toOptsKey(opts),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getBlock(opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getBlockMemo(opts);
  }

  getBlockMemo = memoize(super.getBlock.bind(this), {
    normalizer: ([opts]) => toOptsKey(opts),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getBlockHeader(opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getBlockHeaderMemo(opts);
  }

  getBlockHeaderMemo = memoize(super.getBlockHeader.bind(this), {
    normalizer: ([opts]) => toOptsKey(opts),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  async getBlockMetadata(opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getBlockMetadataMemo(opts);
  }

  getBlockMetadataMemo = memoize(super.getBlockMetadata.bind(this), {
    normalizer: ([opts]) => toOptsKey(opts),
    promise: true,
    maxAge: this.memoizeMaxAge
  });

  getChainId = memoize(super.getChainId.bind(this), { promise: true });

  private async loadLatestBlock(opts?: RPCOptions) {
    const head = wantsHead(opts);
    if (!head) {
      return opts;
    }

    await this.refreshLatestBlock();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { block: this.latestBlock!.hash };
  }

  private refreshLatestBlock = onlyOncePerExec(async () => {
    if (!this.latestBlock || Date.now() - this.latestBlock.refreshedAt > this.refreshInterval) {
      const hash = await super.getBlockHash();
      this.latestBlock = { hash, refreshedAt: Date.now() };
    }
  });
}

function wantsHead(opts?: RPCOptions) {
  return !isDefined(opts) || !isDefined(opts.block) || opts.block === 'head';
}

function toOptsKey(opts?: RPCOptions) {
  return opts?.block ?? 'head';
}

function onlyOncePerExec<T>(factory: () => Promise<T>) {
  let worker: Promise<T> | null = null;

  return () =>
    worker ??
    (worker = factory().finally(() => {
      worker = null;
    }));
}

export const getFastRpcClient = memoize((rpc: string) => new FastRpcClient(rpc));
