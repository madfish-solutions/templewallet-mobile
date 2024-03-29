import { IconNameEnum } from 'src/components/icon/icon-name.enum';

import { emptyTokenMetadata, TokenMetadataInterface, TokenStandardsEnum } from '../interfaces/token-metadata.interface';

export const TEZ_TOKEN_SLUG = 'tez';

export const TEMPLE_TOKEN_METADATA: TokenMetadataInterface = {
  id: 0,
  address: 'KT1VaEsVNiBoA56eToEK6n6BcPgh1tdx9eXi',
  name: 'Temple Key',
  symbol: 'TKEY',
  decimals: 18,
  standard: TokenStandardsEnum.Fa2,
  thumbnailUri: 'ipfs://Qmb9QUXYn1PW8e7E2CwpBMgEur7gFAPPpq2Zh7H2D7eQcT'
};

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

export const TZBTC_TOKEN_METADATA: TokenMetadataInterface = {
  id: 0,
  address: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
  name: 'Tezos BTC',
  symbol: 'tzBTC',
  decimals: 8,
  iconName: IconNameEnum.TzBtcToken,
  standard: TokenStandardsEnum.Fa12
};

export const WTEZ_TOKEN_METADATA: TokenMetadataInterface = {
  id: 0,
  address: 'KT1UpeXdK6AJbX58GJ92pLZVCucn2DR8Nu4b',
  name: 'Wrapped Tezos FA2 token',
  symbol: 'wTEZ',
  decimals: 6,
  thumbnailUri: 'ipfs://QmUWhCYXtC8r8aXgjrwsLrZmopiGMHdLWoQzEueAktJbHB',
  standard: TokenStandardsEnum.Fa2
};

export const SIRS_TOKEN_METADATA: TokenMetadataInterface = {
  id: 0,
  address: 'KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo',
  name: 'Sirius',
  symbol: 'SIRS',
  decimals: 0,
  thumbnailUri: 'ipfs://QmNXQPkRACxaR17cht5ZWaaKiQy46qfCwNVT5FGZy6qnyp',
  standard: TokenStandardsEnum.Fa12
};

const DEPRECATED_TKEY_METADATA: TokenMetadataInterface = {
  address: 'KT1WihWRnmzhfebi6zqQ4tvNGiPeVxiGwTi2',
  id: 0,
  name: 'Deprecated Temple Key',
  symbol: 'TKEY_OLD',
  decimals: 18,
  standard: TokenStandardsEnum.Fa2
};

export const PREDEFINED_MAINNET_TOKENS_METADATA: TokenMetadataInterface[] = [
  TEMPLE_TOKEN_METADATA,
  {
    id: 0,
    address: 'KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o',
    name: 'Tether USD',
    symbol: 'USDt',
    decimals: 6,
    thumbnailUri: 'ipfs://QmRymVGWEudMfLrbjaEiXxngCRTDgWCsscjQMwizy4ZJjX',
    standard: TokenStandardsEnum.Fa2
  },
  {
    id: 0,
    address: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW',
    name: 'youves uUSD',
    symbol: 'uUSD',
    decimals: 12,
    thumbnailUri: 'ipfs://QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd',
    standard: TokenStandardsEnum.Fa2
  },
  {
    id: 0,
    address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
    name: 'Kolibri',
    symbol: 'kUSD',
    decimals: 18,
    thumbnailUri: 'https://kolibri-data.s3.amazonaws.com/logo.png',
    standard: TokenStandardsEnum.Fa12
  },
  TZBTC_TOKEN_METADATA,
  {
    id: 2,
    address: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW',
    name: 'youves uBTC',
    symbol: 'uBTC',
    decimals: 12,
    thumbnailUri: 'ipfs://Qmbev41h4axBqVzxsXP2NSaAF996bJjJBPb8FFZVqTvJTY',
    standard: TokenStandardsEnum.Fa2
  },
  {
    id: 0,
    address: 'KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb',
    name: 'Quipuswap governance token',
    symbol: 'QUIPU',
    decimals: 6,
    thumbnailUri: 'ipfs://Qmb2GiHN9EjcrN29J6y9PsXu3ZDosXTv6uLUWGZfRRSzS2/quipu.png',
    standard: TokenStandardsEnum.Fa2
  },
  {
    id: 0,
    address: 'KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL',
    name: 'youves YOU Governance',
    symbol: 'YOU',
    decimals: 12,
    thumbnailUri: 'ipfs://QmYAJaJvEJuwvMEgRbBoAUKrTxRTT22nCC9RuY7Jy4L4Gc',
    standard: TokenStandardsEnum.Fa2
  },
  WTEZ_TOKEN_METADATA
];

const YUPANA_TOKENS_METADATA_TEMPLATE: Array<Omit<TokenMetadataInterface, 'address'>> = [
  {
    id: 0,
    name: 'Yupana XTZ',
    symbol: 'y-XTZ',
    decimals: 6,
    thumbnailUri: 'ipfs://QmRukmxJkSmu9v2mUutSU7FNMegPramzVgsZ6YfRSWjdnV',
    standard: TokenStandardsEnum.Fa2
  },
  {
    id: 1,
    name: 'Yupana cTez',
    symbol: 'y-cTez',
    decimals: 6,
    thumbnailUri: 'ipfs://Qmb75waMQiExVM8AvVm6VAhJXpA9rP3etUARzzzLTozy1i',
    standard: TokenStandardsEnum.Fa2
  },
  {
    id: 2,
    name: 'Yupana kUSD',
    symbol: 'y-kUSD',
    decimals: 18,
    thumbnailUri: 'ipfs://QmbUocmW1Numv648rcVXx46FxEg91pwPpUHYMW7yc7KVF2',
    standard: TokenStandardsEnum.Fa2
  },
  {
    id: 3,
    name: 'Yupana uUSD',
    symbol: 'y-uUSD',
    decimals: 12,
    thumbnailUri: 'ipfs://QmbQDxZF5kXm8uFhWv4hb4qQcXEkEqgmGfX2J8EVW64BDf',
    standard: TokenStandardsEnum.Fa2
  },
  {
    id: 4,
    name: 'Yupana tzBTC',
    symbol: 'y-tzBTC',
    decimals: 8,
    thumbnailUri: 'ipfs://QmeMiZkN5X7WSVwT32pnaCNCT37BpFXofZUoAn44sLXwoF'
  },
  {
    id: 5,
    name: 'Yupana uBTC',
    symbol: 'y-uBTC',
    decimals: 12,
    thumbnailUri: 'ipfs://QmeNXkS5uDx1Akjp1yXBipw99fkAHvhcm7sXwKfjjVcVEU'
  },
  {
    id: 6,
    name: 'Yupana USDT',
    symbol: 'y-USDT',
    decimals: 6,
    thumbnailUri: 'ipfs://QmYbAvqLYd7KjEuBmZwiuME39gM7Ze99CMMyyK1VPP7VmD'
  },
  {
    id: 7,
    name: 'Yupana SIRS',
    symbol: 'y-SIRS',
    decimals: 0,
    thumbnailUri: 'ipfs://QmVP7fmUwFQJR6kswZCKe85V19SL7RSiK2hTHrsBJsSACb'
  },
  {
    id: 8,
    name: 'Yupana uXTZ',
    symbol: 'y-uXTZ',
    decimals: 6,
    thumbnailUri: 'ipfs://QmcCJVPDBNwCWPK42RTYGtmq91KXJC17756FgkUhDcXRtG'
  }
];

const YUPANA_V1_TOKENS_METADATA = YUPANA_TOKENS_METADATA_TEMPLATE.map(metadata => ({
  ...metadata,
  address: 'KT1Rk86CX85DjBKmuyBhrCyNsHyudHVtASec'
}));
const YUPANA_V2_TOKENS_METADATA = YUPANA_TOKENS_METADATA_TEMPLATE.map(metadata => ({
  ...metadata,
  address: 'KT1CojtgtVHVarS135fnV3y4z8TiKXrsRHJr'
}));

export const OVERRIDEN_MAINNET_TOKENS_METADATA: TokenMetadataInterface[] = [
  DEPRECATED_TKEY_METADATA,
  ...YUPANA_V1_TOKENS_METADATA,
  ...YUPANA_V2_TOKENS_METADATA,
  {
    id: 0,
    address: 'KT1KEsRsSMvSkgZ9CwYy5fPA1e4j3TEpuiKK',
    name: 'Weed',
    symbol: 'WEED',
    decimals: 8,
    thumbnailUri: 'https://i.ibb.co/CnPdk2Y/Weed-Token.jpg',
    standard: TokenStandardsEnum.Fa2
  },
  {
    id: 0,
    address: 'KT19oivKN2qzeWgCs886BbttSVYtkcJHRtuQ',
    name: 'Shitz',
    symbol: 'SHTz',
    decimals: 2,
    thumbnailUri: 'https://i.ibb.co/9ZV2T54/shitz-small.png',
    standard: TokenStandardsEnum.Fa2
  },
  {
    id: 0,
    address: 'KT1M81KrJr6TxYLkZkVqcpSTNKGoya8XytWT',
    name: 'ECOIN NETWORK',
    symbol: 'ECN',
    decimals: 8,
    thumbnailUri: 'https://cdn.tzstats.com/KT1M81KrJr6TxYLkZkVqcpSTNKGoya8XytWT.png',
    standard: TokenStandardsEnum.Fa2
  },
  {
    id: 0,
    address: 'KT1Vn88tz943W4uKvJ2anSS3JJfeiVdQrqLe',
    name: 'TROLL',
    symbol: 'TROLL',
    decimals: 0,
    thumbnailUri: 'ipfs://QmNjXSkR1AgarJdgYQzruQxbh5QZim4Dq1i2vg1LQe8JZk',
    standard: TokenStandardsEnum.Fa2
  },
  {
    id: 0,
    address: 'KT19JYndHaesXpvUfiwgg8BtE41HKkjjGMRC',
    name: 'Rocket',
    symbol: 'RCKT',
    decimals: 6,
    thumbnailUri: 'ipfs://QmNwMXAL5tVaPxauq7W4mXMhFGNVsstBfQ87AwUUo94thL',
    standard: TokenStandardsEnum.Fa2
  }
];

export const PREDEFINED_DCP_TOKENS_METADATA: TokenMetadataInterface[] = [
  {
    id: 0,
    address: 'KT1N7Rh6SgSdExMPxfnYw1tHqrkSm7cm6JDN',
    decimals: 0,
    symbol: 'APX',
    name: 'APXCOIN',
    thumbnailUri: 'https://loonfilms.com/apx/apx-coin-220px.png',
    standard: TokenStandardsEnum.Fa2
  }
];

export const KNOWN_MAINNET_TOKENS_METADATA: TokenMetadataInterface[] = [
  ...PREDEFINED_MAINNET_TOKENS_METADATA,
  ...OVERRIDEN_MAINNET_TOKENS_METADATA
];
