import { encodeFunctionData, erc20Abi, erc721Abi } from 'viem';

import { SendAsset } from 'src/modals/send-modal/send-asset.types';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { erc1155Abi } from 'src/utils/evm/on-chain/abi/erc1155.abi';

export interface BasicEvmTransferRequest {
  to: HexString;
  value: bigint;
  data?: HexString;
}

export const buildEvmTransferRequest = (
  sender: HexString,
  recipient: HexString,
  asset: SendAsset,
  atomicAmount: string
): BasicEvmTransferRequest => {
  const amount = BigInt(atomicAmount);

  switch (asset.sendStandard) {
    case EvmAssetStandardEnum.NATIVE:
      return { to: recipient, value: amount };
    case EvmAssetStandardEnum.ERC20:
      return {
        to: getContractAddress(asset),
        value: 0n,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [recipient, amount]
        })
      };
    case EvmAssetStandardEnum.ERC721:
      return {
        to: getContractAddress(asset),
        value: 0n,
        data: encodeFunctionData({
          abi: erc721Abi,
          functionName: 'safeTransferFrom',
          args: [sender, recipient, BigInt(getTokenId(asset))]
        })
      };
    case EvmAssetStandardEnum.ERC1155:
      return {
        to: getContractAddress(asset),
        value: 0n,
        data: encodeFunctionData({
          abi: erc1155Abi,
          functionName: 'safeTransferFrom',
          args: [sender, recipient, BigInt(getTokenId(asset)), amount, '0x']
        })
      };
    default:
      throw new Error('Unsupported Etherlink asset standard');
  }
};

const getContractAddress = (asset: SendAsset): HexString => {
  if (!asset.contractAddress) {
    throw new Error('Etherlink token contract address is missing');
  }

  return asset.contractAddress;
};

const getTokenId = (asset: SendAsset): string => {
  if (!asset.tokenId) {
    throw new Error('Etherlink collectible token ID is missing');
  }

  return asset.tokenId;
};
