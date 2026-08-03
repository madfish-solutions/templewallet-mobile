import { encodeFunctionData, erc20Abi, erc721Abi } from 'viem';

import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { EvmSendAsset } from 'src/types/send-asset';
import { erc1155Abi } from 'src/utils/evm/on-chain/abi/erc1155.abi';

export interface EvmTransferRequest {
  to: HexString;
  value: bigint;
  data?: HexString;
}

export const buildEvmTransferRequest = (
  sender: HexString,
  recipient: HexString,
  asset: EvmSendAsset,
  atomicAmount: string
): EvmTransferRequest => {
  const amount = BigInt(atomicAmount);

  switch (asset.sendStandard) {
    case EvmAssetStandardEnum.NATIVE:
      return { to: recipient, value: amount };
    case EvmAssetStandardEnum.ERC20:
      return {
        to: asset.contractAddress,
        value: 0n,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [recipient, amount]
        })
      };
    case EvmAssetStandardEnum.ERC721:
      return {
        to: asset.contractAddress,
        value: 0n,
        data: encodeFunctionData({
          abi: erc721Abi,
          functionName: 'safeTransferFrom',
          args: [sender, recipient, BigInt(asset.tokenId)]
        })
      };
    case EvmAssetStandardEnum.ERC1155:
      return {
        to: asset.contractAddress,
        value: 0n,
        data: encodeFunctionData({
          abi: erc1155Abi,
          functionName: 'safeTransferFrom',
          args: [sender, recipient, BigInt(asset.tokenId), amount, '0x']
        })
      };
    default:
      throw new Error('Unsupported Etherlink asset standard');
  }
};
