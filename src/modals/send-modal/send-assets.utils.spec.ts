import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { emptyToken } from 'src/token/interfaces/token.interface';
import { SendAsset } from 'src/types/send-asset';

import { sortSendAssets } from './send-assets.utils';

const sendAsset = (symbol: string, balance: string, decimals?: number): SendAsset => {
  const asset: SendAsset = {
    ...emptyToken,
    name: symbol,
    symbol,
    balance,
    decimals: decimals ?? emptyToken.decimals,
    assetKey: symbol,
    assetSlug: symbol,
    chainKind: TempleChainKind.Tezos,
    chainId: 'mainnet',
    networkName: 'Mainnet',
    sendStandard: 'tezos'
  };

  if (decimals === undefined) {
    Reflect.deleteProperty(asset, 'decimals');
  }

  return asset;
};

describe('sortSendAssets', () => {
  it('sorts by the human-readable balance when fiat values are equal', () => {
    const sorted = sortSendAssets([sendAsset('Low', '1000000', 6), sendAsset('High', '3000000', 6)]);

    expect(sorted.map(asset => asset.symbol)).toEqual(['High', 'Low']);
  });

  it('does not throw when decimals are missing', () => {
    const assets = [sendAsset('Missing', '2000000'), sendAsset('Known', '1000000', 6)];

    expect(() => sortSendAssets(assets)).not.toThrow();
    expect(sortSendAssets(assets).map(asset => asset.symbol)).toEqual(['Missing', 'Known']);
  });
});
