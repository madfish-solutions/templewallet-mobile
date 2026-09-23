import {
  BaseError,
  ContractFunctionZeroDataError,
  erc20Abi,
  HttpRequestError,
  InternalRpcError,
  RpcRequestError,
  TimeoutError,
  TransactionRejectedRpcError
} from 'viem';
import { getCallError, getContractError } from 'viem/utils';

import { EvmNetworkEssentials } from 'src/types/networks';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { detectTokenStandard, isRetryableRpcError } from './common.utils';
import { executeEvmReadContract } from './evm-rpc-requests-executor';
import { EvmAssetStandard } from './types';

jest.mock('./evm-rpc-requests-executor', () => ({ executeEvmReadContract: jest.fn() }));

const mockExecuteEvmReadContract = jest.mocked(executeEvmReadContract);

const RPC_URL = 'https://rpc.test';
const ADDRESS: HexString = '0x0f5d2fb29fb7d3cfee444a200298f468908cc942';
const network: EvmNetworkEssentials = { rpcBaseURL: RPC_URL, chainId: ETHERLINK_MAINNET_CHAIN_ID };

const makeRpcRequestError = (code: number, message: string) =>
  new RpcRequestError({ body: {}, error: { code, message }, url: RPC_URL });

// what readContract throws for a given JSON-RPC error, built with viem's own call and contract wrappers
const makeReadContractError = (rpcError: BaseError, functionName: string) =>
  getContractError(getCallError(rpcError, {}), { abi: erc20Abi, functionName, args: [], address: ADDRESS });

// Etherlink answers a reverted eth_call with -32003 "execution reverted"
const makeRevertError = (functionName: string) =>
  makeReadContractError(
    new TransactionRejectedRpcError(makeRpcRequestError(-32003, 'execution reverted')),
    functionName
  );

const makeOutageError = () => new HttpRequestError({ url: RPC_URL, status: 503 });

describe('isRetryableRpcError', () => {
  it.each<[string, unknown]>([
    ['an Etherlink revert', makeRevertError('supportsInterface')],
    ['an EIP-1474 revert', makeReadContractError(makeRpcRequestError(3, 'execution reverted'), 'totalSupply')],
    ['a call returning no data', new ContractFunctionZeroDataError({ functionName: 'supportsInterface' })],
    ['a plain error', new Error('boom')]
  ])('is false for %s', (_label, error) => {
    expect(isRetryableRpcError(error)).toBe(false);
  });

  it.each<[string, unknown]>([
    ['an http failure', makeOutageError()],
    ['a timeout', new TimeoutError({ body: {}, url: RPC_URL })],
    [
      'an internal node error inside a contract read',
      makeReadContractError(new InternalRpcError(makeRpcRequestError(-32603, 'internal error')), 'decimals')
    ]
  ])('is true for %s', (_label, error) => {
    expect(isRetryableRpcError(error)).toBe(true);
  });
});

describe('detectTokenStandard', () => {
  beforeEach(() => mockExecuteEvmReadContract.mockReset());

  it('detects ERC-721 from supportsInterface', async () => {
    mockExecuteEvmReadContract.mockResolvedValueOnce(true);

    await expect(detectTokenStandard(network, ADDRESS)).resolves.toBe(EvmAssetStandard.ERC721);
  });

  it('detects ERC-1155 from supportsInterface', async () => {
    mockExecuteEvmReadContract.mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    await expect(detectTokenStandard(network, ADDRESS)).resolves.toBe(EvmAssetStandard.ERC1155);
  });

  it('falls through to the ERC-20 check when supportsInterface reverts', async () => {
    mockExecuteEvmReadContract
      .mockRejectedValueOnce(makeRevertError('supportsInterface'))
      .mockResolvedValueOnce(BigInt(1));

    await expect(detectTokenStandard(network, ADDRESS)).resolves.toBe(EvmAssetStandard.ERC20);
    expect(mockExecuteEvmReadContract).toHaveBeenCalledTimes(2);
  });

  it('falls through to the ERC-20 check when the contract has no supportsInterface', async () => {
    mockExecuteEvmReadContract
      .mockRejectedValueOnce(new ContractFunctionZeroDataError({ functionName: 'supportsInterface' }))
      .mockResolvedValueOnce(BigInt(1));

    await expect(detectTokenStandard(network, ADDRESS)).resolves.toBe(EvmAssetStandard.ERC20);
  });

  it('reports no standard when every probe reverts', async () => {
    mockExecuteEvmReadContract
      .mockRejectedValueOnce(makeRevertError('supportsInterface'))
      .mockRejectedValueOnce(makeRevertError('totalSupply'));

    await expect(detectTokenStandard(network, ADDRESS)).resolves.toBeUndefined();
  });

  it('propagates an RPC outage instead of guessing the standard', async () => {
    mockExecuteEvmReadContract.mockRejectedValueOnce(makeOutageError());

    await expect(detectTokenStandard(network, ADDRESS)).rejects.toBeInstanceOf(HttpRequestError);
    expect(mockExecuteEvmReadContract).toHaveBeenCalledTimes(1);
  });
});
