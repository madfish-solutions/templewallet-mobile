import { VisibilityEnum } from '../../enums/visibility.enum';
import { getTokenSlug } from '../utils/token.utils';
import { AccountTokenInterface } from './account-token.interface';

export const MAINNET_TOKENS_METADATA = [
  {
    id: 0,
    address: 'KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb',
    name: 'Quipuswap governance token',
    symbol: 'QUIPU',
    decimals: 6,
    thumbnailUri: 'https://quipuswap.com/tokens/quipu.png'
  },
  {
    id: 0,
    address: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
    name: 'Tezos BTC',
    symbol: 'tzBTC',
    decimals: 8
  },
  {
    id: 19,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    name: 'Wrapped WBTC',
    symbol: 'wWBTC',
    decimals: 8,
    thumbnailUri: 'ipfs://Qmdj6n9T48LDWex8NkBMKUQJfZgardxZVdtRRibYQVzLCJ'
  },
  {
    id: 0,
    address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
    name: 'Kolibri',
    symbol: 'kUSD',
    decimals: 18,
    thumbnailUri: 'https://kolibri-data.s3.amazonaws.com/logo.png'
  },
  {
    id: 0,
    address: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW',
    name: 'youves uUSD',
    symbol: 'uUSD',
    decimals: 12,
    thumbnailUri: 'ipfs://QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd'
  }
];

export const mockAccountTokens: AccountTokenInterface[] = MAINNET_TOKENS_METADATA.map(token => ({
  slug: getTokenSlug(token),
  balance: '33',
  visibility: VisibilityEnum.Visible
}));
