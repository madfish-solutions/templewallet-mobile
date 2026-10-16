import type { TezosTokenMetadata } from './token-metadata.interface';

export const mockFA1_2TokenMetadata: TezosTokenMetadata = {
  id: 0,
  address: 'fa12TokenAddress',
  name: 'Mock FA1.2 token',
  symbol: 'MOCK12',
  decimals: 6,
  thumbnailUri: 'https://fakeurl.com/img.png'
};

export const mockFA2TokenMetadata: TezosTokenMetadata = {
  id: 2,
  address: 'fa2TokenAddress',
  name: 'Mock FA2 token',
  symbol: 'MOCK2',
  decimals: 8,
  thumbnailUri: 'https://fakeurl.com/img2.png'
};
