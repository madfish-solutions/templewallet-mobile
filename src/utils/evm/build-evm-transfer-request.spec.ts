import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { EvmNativeSendAsset, EvmSendAsset } from 'src/types/send-asset';

import { buildEvmTransferRequest } from './build-evm-transfer-request';

const sender = '0x1111111111111111111111111111111111111111';
const recipient = '0x2222222222222222222222222222222222222222';
const contractAddress = '0x3333333333333333333333333333333333333333';

const makeAsset = (sendStandard: EvmAssetStandardEnum): EvmSendAsset => {
  const base: Omit<EvmNativeSendAsset, 'assetSlug' | 'sendStandard'> = {
    name: sendStandard,
    symbol: sendStandard,
    decimals: 18,
    balance: '1000',
    assetKey: `evm:42793:${sendStandard}`,
    chainKind: TempleChainKind.EVM,
    chainId: 42793,
    networkName: 'Etherlink'
  };

  switch (sendStandard) {
    case EvmAssetStandardEnum.NATIVE:
      return { ...base, assetSlug: 'eth', sendStandard };
    case EvmAssetStandardEnum.ERC20:
      return { ...base, assetSlug: sendStandard, sendStandard, contractAddress };
    case EvmAssetStandardEnum.ERC721:
    case EvmAssetStandardEnum.ERC1155:
      return { ...base, assetSlug: sendStandard, sendStandard, contractAddress, tokenId: '7' };
  }
};

describe('buildEvmTransferRequest', () => {
  it('builds a native transfer', () => {
    expect(buildEvmTransferRequest(sender, recipient, makeAsset(EvmAssetStandardEnum.NATIVE), '42')).toEqual({
      to: recipient,
      value: 42n
    });
  });

  it.each([
    [EvmAssetStandardEnum.ERC20, '0xa9059cbb'],
    [EvmAssetStandardEnum.ERC721, '0x42842e0e'],
    [EvmAssetStandardEnum.ERC1155, '0xf242432a']
  ])('encodes a %s transfer', (standard, selector) => {
    const request = buildEvmTransferRequest(sender, recipient, makeAsset(standard), '2');

    expect(request.to).toBe(contractAddress);
    expect(request.value).toBe(0n);
    expect(request.data?.slice(0, 10)).toBe(selector);
  });
});
