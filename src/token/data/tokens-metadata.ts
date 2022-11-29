import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { emptyTokenMetadata, TokenMetadataInterface } from '../interfaces/token-metadata.interface';

export const TEZ_TOKEN_SLUG = 'tez';

export const TEZ_TOKEN_METADATA: TokenMetadataInterface = {
  ...emptyTokenMetadata,
  name: 'Tezos',
  symbol: 'TEZ',
  decimals: 6,
  iconName: IconNameEnum.TezToken
};

export const FILM_TOKEN_METADATA: TokenMetadataInterface = {
  ...emptyTokenMetadata,
  name: 'FILM',
  symbol: 'FILM',
  decimals: 6,
  iconName: IconNameEnum.FilmToken
};

export const LOCAL_MAINNET_TOKENS_METADATA: TokenMetadataInterface[] = [
  {
    id: 0,
    address: 'KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o',
    name: 'Tether USD',
    symbol: 'USDt',
    decimals: 6,
    thumbnailUri: 'ipfs://QmRymVGWEudMfLrbjaEiXxngCRTDgWCsscjQMwizy4ZJjX'
  },
  {
    id: 0,
    address: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW',
    name: 'youves uUSD',
    symbol: 'uUSD',
    decimals: 12,
    thumbnailUri: 'ipfs://QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd'
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
    address: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
    name: 'Tezos BTC',
    symbol: 'tzBTC',
    decimals: 8,
    iconName: IconNameEnum.TzBtcToken
  },
  {
    id: 2,
    address: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW',
    name: 'youves uBTC',
    symbol: 'uBTC',
    decimals: 12,
    thumbnailUri: 'ipfs://Qmbev41h4axBqVzxsXP2NSaAF996bJjJBPb8FFZVqTvJTY'
  },
  {
    id: 0,
    address: 'KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb',
    name: 'Quipuswap governance token',
    symbol: 'QUIPU',
    decimals: 6,
    thumbnailUri: 'ipfs://Qmb2GiHN9EjcrN29J6y9PsXu3ZDosXTv6uLUWGZfRRSzS2/quipu.png'
  },
  {
    id: 0,
    address: 'KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL',
    name: 'youves YOU Governance',
    symbol: 'YOU',
    decimals: 12,
    thumbnailUri: 'ipfs://QmYAJaJvEJuwvMEgRbBoAUKrTxRTT22nCC9RuY7Jy4L4Gc'
  }
];

export const DCP_TOKENS_METADATA: TokenMetadataInterface[] = [
  {
    id: 0,
    address: 'KT1N7Rh6SgSdExMPxfnYw1tHqrkSm7cm6JDN',
    decimals: 0,
    symbol: 'APX',
    name: 'APXCOIN',
    thumbnailUri: 'https://loonfilms.com/apx/apx-coin-220px.png'
  }
];
