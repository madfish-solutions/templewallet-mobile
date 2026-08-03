import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { EvmAssetStandardEnum, TezosTokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { ETHERLINK_MAINNET_CHAIN_SPECS } from 'src/types/networks';
import { SendAsset } from 'src/types/send-asset';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { sortSendAssets } from './send-assets.utils';
import { createEvmSendAssets } from './use-evm-send-assets.hook';
import { createTezosSendAssets } from './use-tezos-send-assets.hook';

const EVM_CONTRACT = '0x1111111111111111111111111111111111111111';
const EVM_TOKEN_SLUG = EVM_CONTRACT;

const makeTezosToken = (overrides: Partial<TokenInterface> = {}): TokenInterface => ({
  address: '',
  id: 0,
  name: 'Tezos',
  symbol: 'TEZ',
  decimals: 6,
  balance: '1000000',
  visibility: VisibilityEnum.Visible,
  ...overrides
});

describe('send asset adapters', () => {
  it('normalizes, deduplicates and filters Tezos assets', () => {
    const tezosToken = makeTezosToken();
    const duplicateTezosToken = makeTezosToken({ balance: '9999999' });
    const fungibleToken = makeTezosToken({
      address: 'KT1Token',
      name: 'Token',
      symbol: 'TKN',
      standard: TezosTokenStandardsEnum.Fa2,
      balance: '42'
    });

    const assets = createTezosSendAssets({
      shieldedBalance: '25',
      shieldedExchangeRate: 1.5,
      tezosToken,
      tezosTokens: [duplicateTezosToken, fungibleToken, makeTezosToken({ address: 'KT1Zero', balance: '0' })]
    });

    expect(assets).toHaveLength(3);
    expect(assets[0]).toMatchObject({ assetSlug: 'tez', balance: '1000000', sendStandard: 'tezos' });
    expect(assets[1]).toMatchObject({
      assetSlug: 'shielded_tez_0',
      balance: '25',
      exchangeRate: 1.5,
      sendStandard: 'shielded-tez'
    });
    expect(assets[2]).toMatchObject({ assetSlug: 'KT1Token_0', balance: '42', sendStandard: 'tezos' });
  });

  it('reconciles EVM discovery, balances and metadata while excluding unsupported assets', () => {
    const nftSlug = '0x2222222222222222222222222222222222222222_1';
    const assets = createEvmSendAssets({
      assets: {
        [EVM_TOKEN_SLUG]: { standard: EvmAssetStandardEnum.ERC20, manual: false },
        [nftSlug]: { standard: EvmAssetStandardEnum.ERC721, manual: false }
      },
      balances: { eth: '2000000000000000000', [EVM_TOKEN_SLUG]: '500', [nftSlug]: '1', unknown: '10' },
      exchangeRates: { eth: 2, [EVM_TOKEN_SLUG]: 4 },
      fiatToUsdRate: 0.5,
      hasAccount: true,
      network: ETHERLINK_MAINNET_CHAIN_SPECS,
      tokensMetadata: {
        [EVM_TOKEN_SLUG]: {
          address: EVM_CONTRACT,
          standard: EvmAssetStandardEnum.ERC20,
          name: 'USD Token',
          symbol: 'USDT',
          decimals: 2,
          iconURL: 'token-icon'
        }
      }
    });

    expect(assets).toHaveLength(2);
    expect(assets[0]).toMatchObject({
      assetSlug: 'eth',
      balance: '2000000000000000000',
      exchangeRate: 1,
      chainId: ETHERLINK_MAINNET_CHAIN_ID,
      sendStandard: EvmAssetStandardEnum.NATIVE
    });
    expect(assets[1]).toMatchObject({
      assetSlug: EVM_TOKEN_SLUG,
      balance: '500',
      contractAddress: EVM_CONTRACT,
      exchangeRate: 2,
      name: 'USD Token',
      symbol: 'USDT',
      sendStandard: EvmAssetStandardEnum.ERC20
    });
    expect(assets[1]).not.toHaveProperty('address');
    expect(assets[1]).not.toHaveProperty('id');
    expect(assets[1]).not.toHaveProperty('standard');
  });

  it('derives EVM identity from the selected network configuration', () => {
    const network = { ...ETHERLINK_MAINNET_CHAIN_SPECS, chainId: 1, name: 'Configured network' };

    expect(
      createEvmSendAssets({
        assets: {},
        balances: { eth: '1' },
        exchangeRates: {},
        hasAccount: true,
        network,
        tokensMetadata: {}
      })
    ).toEqual([
      expect.objectContaining({
        assetKey: 'evm:1:eth',
        chainId: 1,
        networkName: 'Configured network'
      })
    ]);
  });

  it('does not expose EVM assets without an EVM account', () => {
    expect(
      createEvmSendAssets({
        assets: {},
        balances: { eth: '1' },
        exchangeRates: {},
        hasAccount: false,
        tokensMetadata: {}
      })
    ).toEqual([]);
  });

  it('sorts by fiat value, then normalized balance, then symbol', () => {
    const makeAsset = (symbol: string, balance: string, exchangeRate?: number): SendAsset => ({
      ...makeTezosToken({ symbol, balance, exchangeRate }),
      assetKey: symbol,
      assetSlug: symbol,
      chainKind: TempleChainKind.Tezos,
      chainId: 'mainnet',
      networkName: 'Tezos',
      sendStandard: 'tezos'
    });
    const assets = [
      makeAsset('B', '1000000'),
      makeAsset('C', '2000000'),
      makeAsset('A', '1000000'),
      makeAsset('D', '1000000', 10)
    ];

    expect(sortSendAssets(assets).map(({ symbol }) => symbol)).toEqual(['D', 'C', 'A', 'B']);
  });
});
