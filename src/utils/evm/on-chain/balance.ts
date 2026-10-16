import { erc20Abi, erc721Abi } from 'viem';

import { EvmNetworkEssentials } from 'src/types/networks';

import { erc1155Abi } from './abi/erc1155.abi';
import { equalsIgnoreCase } from './common.utils';
import { executeEvmGetBalance, executeEvmReadContract } from './evm-rpc-requests-executor';
import { EvmAssetStandard, EvmContractAssetStandard } from './types';

export const getEvmNativeBalance = async (
  network: EvmNetworkEssentials,
  account: HexString
): Promise<string | undefined> => {
  try {
    const balance = await executeEvmGetBalance(network, account);

    return balance.toString();
  } catch (error) {
    console.error(`Failed to fetch native balance for chainId ${network.chainId}`, error);

    return undefined;
  }
};

export const getEvmAssetBalance = async (
  network: EvmNetworkEssentials,
  account: HexString,
  contract: HexString,
  tokenId = '0',
  standard: EvmContractAssetStandard
): Promise<string | undefined> => {
  try {
    if (standard === EvmAssetStandard.ERC1155) {
      const balance = await executeEvmReadContract<bigint>(network, {
        address: contract,
        abi: erc1155Abi,
        functionName: 'balanceOf',
        args: [account, BigInt(tokenId)]
      });

      return balance.toString();
    }

    if (standard === EvmAssetStandard.ERC721) {
      const owner = await executeEvmReadContract<HexString>(network, {
        address: contract,
        abi: erc721Abi,
        functionName: 'ownerOf',
        args: [BigInt(tokenId)]
      });

      return equalsIgnoreCase(owner, account) ? '1' : '0';
    }

    const balance = await executeEvmReadContract<bigint>(network, {
      address: contract,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account]
    });

    return balance.toString();
  } catch (error) {
    console.error(`Failed to fetch balance for ${contract} on chainId ${network.chainId}`, error);

    return undefined;
  }
};
