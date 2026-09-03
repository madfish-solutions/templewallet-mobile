import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { EvmChainSpecs } from 'src/types/networks';

import { findNetworkLabel, getTokenPageTitles } from './use-token-page-titles.hook';

const EVM_CHAINS_SPECS: EvmChainSpecs[] = [
  { name: 'Etherlink', chainId: 42793, default: true },
  { name: 'Second Chain', chainId: 999, default: false }
];

describe('findNetworkLabel', () => {
  it('returns the Tezos chain name for Tezos refs regardless of specs', () => {
    expect(findNetworkLabel([], { chainKind: TempleChainKind.Tezos, chainId: 'NetXdQprcVkpaWU' })).toBe('Tezos');
  });

  it('returns the matching EVM chain name by chainId', () => {
    expect(findNetworkLabel(EVM_CHAINS_SPECS, { chainKind: TempleChainKind.EVM, chainId: 999 })).toBe('Second Chain');
  });

  it('falls back to the Etherlink name for an unknown EVM chainId', () => {
    expect(findNetworkLabel(EVM_CHAINS_SPECS, { chainKind: TempleChainKind.EVM, chainId: 1 })).toBe('Etherlink');
  });
});

describe('getTokenPageTitles', () => {
  it('shows the symbol as identity title when the token is named after the network', () => {
    expect(getTokenPageTitles({ name: 'Tezos', symbol: 'XTZ' }, 'Tezos')).toEqual({
      identityTitle: 'XTZ',
      headerTitle: 'Tezos',
      networkLabel: 'Tezos'
    });
  });

  it('shows the name as identity title and the symbol as header title otherwise', () => {
    expect(getTokenPageTitles({ name: 'Tether USD', symbol: 'USDT' }, 'Etherlink')).toEqual({
      identityTitle: 'Tether USD',
      headerTitle: 'USDT',
      networkLabel: 'Etherlink'
    });
  });
});
