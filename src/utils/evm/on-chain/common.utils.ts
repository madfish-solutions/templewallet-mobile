import { erc20Abi, parseAbi } from 'viem';

import { EvmNetworkEssentials } from 'src/types/networks';

import { executeEvmReadContract } from './evm-rpc-requests-executor';
import { EvmAssetStandard, EvmContractAssetStandard } from './types';

const supportsInterfaceAbi = parseAbi(['function supportsInterface(bytes4 interfaceId) external view returns (bool)']);

const ERC721_INTERFACE_ID: HexString = '0x80ac58cd';
const ERC1155_INTERFACE_ID: HexString = '0xd9b67a26';

export const equalsIgnoreCase = (a?: string, b?: string) => a?.toLowerCase() === b?.toLowerCase();

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
  } catch {
    // fall through to the ERC-20 check
  }

  try {
    await executeEvmReadContract(network, {
      address: contractAddress,
      abi: erc20Abi,
      functionName: 'totalSupply'
    });

    return EvmAssetStandard.ERC20;
  } catch {
    return undefined;
  }
};
