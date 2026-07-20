import { Abi } from 'viem';

import { EvmNetworkEssentials } from 'src/types/networks';
import { ConcurrencyLimiter } from 'src/utils/concurrency-limiter.utils';
import { getViemPublicClient } from 'src/utils/rpc/evm-client.utils';

const RPS_LIMIT = 15;
const RPS_SLOT_RELEASE_DELAY = 1000;

interface ReadContractRequestParams {
  address: HexString;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
}

interface EvmReadContractRequest {
  kind: 'readContract';
  network: EvmNetworkEssentials;
  params: ReadContractRequestParams;
}

interface EvmGetBalanceRequest {
  kind: 'getBalance';
  network: EvmNetworkEssentials;
  params: { address: HexString };
}

type EvmOnChainReadPayload = EvmReadContractRequest | EvmGetBalanceRequest;

interface RequestsPool {
  rpsLimiter: ConcurrencyLimiter;
  pendingRequests: Map<string, Promise<unknown>>;
}

const requestsPools = new Map<number, RequestsPool>();

const getOrCreatePool = (chainId: number): RequestsPool => {
  let pool = requestsPools.get(chainId);
  if (!pool) {
    pool = { rpsLimiter: new ConcurrencyLimiter(RPS_LIMIT), pendingRequests: new Map() };
    requestsPools.set(chainId, pool);
  }

  return pool;
};

const serializeArgs = (args?: readonly unknown[]): string => (args == null ? '' : args.map(String).join('|'));

const serializeRequest = (payload: EvmOnChainReadPayload): string =>
  payload.kind === 'getBalance'
    ? `${payload.kind}_${payload.params.address}`
    : `${payload.kind}_${payload.params.address}_${payload.params.functionName}_${serializeArgs(payload.params.args)}`;

const getResult = (payload: EvmOnChainReadPayload): Promise<unknown> => {
  const publicClient = getViemPublicClient(payload.network);

  return payload.kind === 'getBalance'
    ? publicClient.getBalance(payload.params)
    : publicClient.readContract(payload.params);
};

const executeRequest = (payload: EvmOnChainReadPayload): Promise<unknown> => {
  const pool = getOrCreatePool(payload.network.chainId);
  const requestKey = serializeRequest(payload);

  const pendingRequest = pool.pendingRequests.get(requestKey);
  if (pendingRequest) {
    return pendingRequest;
  }

  const reqPromise = pool.rpsLimiter
    .acquire()
    .then(release => {
      setTimeout(release, RPS_SLOT_RELEASE_DELAY);

      return getResult(payload);
    })
    .finally(() => {
      pool.pendingRequests.delete(requestKey);
    });

  pool.pendingRequests.set(requestKey, reqPromise);

  return reqPromise;
};

export function executeEvmReadContract<T>(network: EvmNetworkEssentials, params: ReadContractRequestParams): Promise<T>;
export function executeEvmReadContract(
  network: EvmNetworkEssentials,
  params: ReadContractRequestParams
): Promise<unknown> {
  return executeRequest({ kind: 'readContract', network, params });
}

export function executeEvmGetBalance(network: EvmNetworkEssentials, address: HexString): Promise<bigint>;
export function executeEvmGetBalance(network: EvmNetworkEssentials, address: HexString): Promise<unknown> {
  return executeRequest({ kind: 'getBalance', network, params: { address } });
}

export const acquireEvmRpsSlot = async (network: EvmNetworkEssentials): Promise<void> => {
  const release = await getOrCreatePool(network.chainId).rpsLimiter.acquire();

  setTimeout(release, RPS_SLOT_RELEASE_DELAY);
};
