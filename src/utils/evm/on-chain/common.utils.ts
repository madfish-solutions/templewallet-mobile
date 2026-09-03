import {
  BaseError,
  erc20Abi,
  ExecutionRevertedError,
  HttpRequestError,
  parseAbi,
  RpcRequestError,
  TimeoutError
} from 'viem';

import { EvmNetworkEssentials } from 'src/types/networks';

import { executeEvmReadContract } from './evm-rpc-requests-executor';
import { EvmAssetStandard, EvmContractAssetStandard } from './types';

const supportsInterfaceAbi = parseAbi(['function supportsInterface(bytes4 interfaceId) external view returns (bool)']);

const ERC721_INTERFACE_ID: HexString = '0x80ac58cd';
const ERC1155_INTERFACE_ID: HexString = '0xd9b67a26';

export const equalsIgnoreCase = (a?: string, b?: string) => a?.toLowerCase() === b?.toLowerCase();

const isRevertError = (error: unknown) => error instanceof ExecutionRevertedError;

const isTransportError = (error: unknown) =>
  error instanceof HttpRequestError || error instanceof TimeoutError || error instanceof RpcRequestError;

// a reverted eth_call keeps the raw RPC error in its cause chain, so reverts must be ruled out first
export const isRetryableRpcError = (error: unknown): boolean =>
  error instanceof BaseError && error.walk(isRevertError) == null && error.walk(isTransportError) != null;

export const detectTokenStandard = async (
  network: EvmNetworkEssentials,
  contractAddress: HexString
): Promise<EvmContractAssetStandard | undefined> => {
  try {
    const isErc721Supported = await executeEvmReadContract<boolean>(network, {
      address: contractAddress,
      abi: supportsInterfaceAbi,
      functionName: 'supportsInterface',
      args: [ERC721_INTERFACE_ID]
    });

    if (isErc721Supported) {
      return EvmAssetStandard.ERC721;
    }

    const isErc1155Supported = await executeEvmReadContract<boolean>(network, {
      address: contractAddress,
      abi: supportsInterfaceAbi,
      functionName: 'supportsInterface',
      args: [ERC1155_INTERFACE_ID]
    });

    if (isErc1155Supported) {
      return EvmAssetStandard.ERC1155;
    }
  } catch (error) {
    if (isRetryableRpcError(error)) {
      throw error;
    }
    // fall through to the ERC-20 check
  }

  try {
    await executeEvmReadContract(network, {
      address: contractAddress,
      abi: erc20Abi,
      functionName: 'totalSupply'
    });

    return EvmAssetStandard.ERC20;
  } catch (error) {
    if (isRetryableRpcError(error)) {
      throw error;
    }

    return undefined;
  }
};
