import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { SendAsset } from 'src/modals/send-modal/send-asset.types';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';

import { buildEvmTransferRequest } from './build-evm-transfer-request';

const sender = '0x1111111111111111111111111111111111111111';
const recipient = '0x2222222222222222222222222222222222222222';
const contractAddress = '0x3333333333333333333333333333333333333333';

const makeAsset = (sendStandard: EvmAssetStandardEnum): SendAsset => ({
  address: `evm:42793:${sendStandard}`,
  id: 0,
  name: sendStandard,
  symbol: sendStandard,
  decimals: 18,
  balance: '1000',
  visibility: VisibilityEnum.Visible,
  assetKey: `evm:42793:${sendStandard}`,
  assetSlug: sendStandard,
  chainKind: TempleChainKind.EVM,
  chainId: 42793,
  networkName: 'Etherlink',
  sendStandard,
  contractAddress,
  tokenId: '7'
});

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
