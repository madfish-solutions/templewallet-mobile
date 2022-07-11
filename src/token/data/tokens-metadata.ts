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

export const MAINNET_TOKENS_METADATA: TokenMetadataInterface[] = [
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
    decimals: 8,
    iconName: IconNameEnum.TzBtcToken
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

export const HIDDEN_WHITELIST_TOKENS: TokenMetadataInterface[] = [
  {
    id: 0,
    address: 'KT1VYsVfmobT7rsMVivvZ4J8i3bPiqz12NaH',
    symbol: 'wXTZ',
    name: 'Wrapped Tezos',
    thumbnailUri: 'https://raw.githubusercontent.com/StakerDAO/wrapped-xtz/dev/assets/wXTZ-token-FullColor.png',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT1REEb5VxWRjcHm5GzDMwErMmNFftsE5Gpf',
    symbol: 'USDS',
    name: 'Stably USD',
    thumbnailUri: 'ipfs://Qmb2GiHN9EjcrN29J6y9PsXu3ZDosXTv6uLUWGZfRRSzS2/stably.png',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT1AEfeckNbdEYwaMKkytBwPJPycz7jdSGea',
    symbol: 'STKR',
    name: 'Staker Governance Token',
    thumbnailUri: 'https://github.com/StakerDAO/resources/raw/main/stkr.png',
    decimals: 18
  },
  {
    id: 0,
    address: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
    symbol: 'USDtz',
    name: 'USDtez',
    thumbnailUri: 'ipfs://Qmb2GiHN9EjcrN29J6y9PsXu3ZDosXTv6uLUWGZfRRSzS2/usdtz.png',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
    symbol: 'ETHtz',
    name: 'ETHtez',
    thumbnailUri: 'ipfs://Qmb2GiHN9EjcrN29J6y9PsXu3ZDosXTv6uLUWGZfRRSzS2/ethtz.png',
    decimals: 18
  },
  {
    id: 0,
    address: 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW',
    symbol: 'hDAO',
    name: 'hic et nunc DAO',
    thumbnailUri: 'ipfs://QmPfBrZiRsC39S2VvNbhuxH9HnNcSx8aef9uBCG51J5c4e',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd',
    symbol: 'WRAP',
    name: 'Wrap Governance Token',
    thumbnailUri: 'ipfs://Qma2o69VRZe8aPsuCUN1VRUE5k67vw2mFDXb35uDkqn17o',
    decimals: 8
  },
  {
    id: 0,
    address: 'KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng',
    symbol: 'CRUNCH',
    name: 'CRUNCH',
    thumbnailUri: 'ipfs://bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq',
    decimals: 8
  },
  {
    id: 0,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wAAVE',
    name: 'Wrapped AAVE',
    thumbnailUri: 'ipfs://QmVUVanUUjHmgkjnUC6TVzG7pPz6iy7C8tnAoXNNpofYPg',
    decimals: 18
  },
  {
    id: 1,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wBUSD',
    name: 'Wrapped BUSD',
    thumbnailUri: 'ipfs://QmRB63vb8ThpmxHKF4An3XD8unHyCUuLYm5bZNhXwU4gAZ',
    decimals: 18
  },
  {
    id: 2,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wCEL',
    name: 'Wrapped CEL',
    thumbnailUri: 'ipfs://QmfNuyU3V6XeS9PgVXMDq4h5ux1VciUXtApP2ZGC4VSGLd',
    decimals: 4
  },
  {
    id: 3,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wCOMP',
    name: 'Wrapped COMP',
    thumbnailUri: 'ipfs://QmYy2jUUE69W5eE9uwh4x5LqUxHt3GVy8sjXHhpViqCspG',
    decimals: 18
  },
  {
    id: 4,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wCRO',
    name: 'Wrapped CRO',
    thumbnailUri: 'ipfs://QmUuhxgCm2EXwddpU8ofBBh9z1qzxf2BJRbxxR1ebYr8Hd',
    decimals: 8
  },
  {
    id: 5,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wDAI',
    name: 'Wrapped DAI',
    thumbnailUri: 'ipfs://QmVov6RtfRNzuQGvGKmhnABUsfCiDKvn31amg8DUxzowtM',
    decimals: 18
  },
  {
    id: 6,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wFTT',
    name: 'Wrapped FTT',
    thumbnailUri: 'ipfs://QmVBjgrJiUynv72MR6rRyUu1WLKX52bWGiKk7H2CaFDRNW',
    decimals: 18
  },
  {
    id: 7,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wHT',
    name: 'Wrapped HT',
    thumbnailUri: 'ipfs://Qmayt4JbYTkQinNUeVGLhp51LTRMD1273HRgo9p96SoQaM',
    decimals: 18
  },
  {
    id: 8,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wHUSD',
    name: 'Wrapped HUSD',
    thumbnailUri: 'ipfs://QmT9bozupnmWjmjnXp8KcZqDY9HYLLr5KgojfxqgoWRgCt',
    decimals: 8
  },
  {
    id: 9,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wLEO',
    name: 'Wrapped LEO',
    thumbnailUri: 'ipfs://QmPrmELnhSoheHCHx6XcjSera7f89NYmXabBnSRSCdDjBh',
    decimals: 18
  },
  {
    id: 10,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wLINK',
    name: 'Wrapped LINK',
    thumbnailUri: 'ipfs://QmeaRuB578Xgy8jxbTxqmQ9s5wyioAEP85V7qbJFnn2uT8',
    decimals: 18
  },
  {
    id: 11,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wMATIC',
    name: 'Wrapped MATIC',
    thumbnailUri: 'ipfs://QmchBnjRjpweznHes7bVKHwgzd8D6Q7Yzwf6KmA4KS6Dgi',
    decimals: 18
  },
  {
    id: 12,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wMKR',
    name: 'Wrapped MKR',
    thumbnailUri: 'ipfs://QmPTob6YP9waErN4gMXqHg6ZyazSFB9CEojot4BB2XPpZJ',
    decimals: 18
  },
  {
    id: 13,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wOKB',
    name: 'Wrapped OKB',
    thumbnailUri: 'ipfs://QmPpmuLw4i9qJLMmGjXrGxrcPBwTiNZgLGuh7kYXeyTdyA',
    decimals: 18
  },
  {
    id: 14,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wPAX',
    name: 'Wrapped PAX',
    thumbnailUri: 'ipfs://QmZD5QDAeAUyyLYKiMmxD4vfWpVeYHctcbTkPmo4NudDHt',
    decimals: 18
  },
  {
    id: 15,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wSUSHI',
    name: 'Wrapped SUSHI',
    thumbnailUri: 'ipfs://QmTpss9a4uL3op7x5Lte7CcTKUSUhZsM1Gr34BWNvZCfy4',
    decimals: 18
  },
  {
    id: 16,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wUNI',
    name: 'Wrapped UNI',
    thumbnailUri: 'ipfs://QmQBezdVvotCGnFHgQNKduLdxEJhfgruSEqtwnWY7mESb2',
    decimals: 18
  },
  {
    id: 17,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wUSDC',
    name: 'Wrapped USDC',
    thumbnailUri: 'ipfs://QmQfHU9mYLRDU4yh2ihm3zrvVFxDrLPiXNYtMovUQE2S2t',
    decimals: 6
  },
  {
    id: 18,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wUSDT',
    name: 'Wrapped USDT',
    thumbnailUri: 'ipfs://QmVbiHa37pe2U9FfXBYfvrLNpb38rbXwaN19HwZD2speFA',
    decimals: 6
  },
  {
    id: 20,
    address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
    symbol: 'wWETH',
    name: 'Wrapped WETH',
    thumbnailUri: 'ipfs://Qmezz1ztvo5JFshHupBEdUzVppyMfJH6K4kPjQRSZp8cLq',
    decimals: 18
  },
  {
    id: 0,
    address: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
    symbol: 'PLENTY',
    name: 'Plenty DAO',
    thumbnailUri: 'https://raw.githubusercontent.com/Plenty-DeFi/Plenty-Logo/main/PlentyTokenIcon.png',
    decimals: 18
  },
  {
    id: 0,
    address: 'KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT',
    symbol: 'KALAM',
    name: 'Kalamint',
    thumbnailUri: 'ipfs://Qme9FX9M7o2PZt9h6rvkUbfXoLpQr1HsuMQi6sL5Y75g3A',
    decimals: 10
  },
  {
    id: 0,
    address: 'KT1XPFjZqCULSnqfKaaYy8hJjeY63UNSGwXg',
    symbol: 'crDAO',
    name: 'Crunchy DAO',
    thumbnailUri: 'ipfs://bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u',
    decimals: 8
  },
  {
    id: 0,
    address: 'KT1TwzD6zV3WeJ39ukuqxcfK2fJCnhvrdN1X',
    symbol: 'SMAK',
    name: 'SmartLink',
    thumbnailUri: 'ipfs://Qmb2GiHN9EjcrN29J6y9PsXu3ZDosXTv6uLUWGZfRRSzS2/smak.png',
    decimals: 3
  },
  {
    id: 0,
    address: 'KT1JkoE42rrMBP9b2oDhbx6EUr26GcySZMUH',
    symbol: 'kDAO',
    name: 'Kolibri DAO',
    thumbnailUri: 'https://kolibri-data.s3.amazonaws.com/kdao-logo.png',
    decimals: 18
  },
  {
    id: 1,
    address: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW',
    symbol: 'uDEFI',
    name: 'youves uDEFI',
    thumbnailUri: 'ipfs://QmNfosyixuXVG2TGmE7FmLGZGJhK2Q9qHZicsMixsbgqH1',
    decimals: 12
  },
  {
    id: 0,
    address: 'KT1GUNKmkrgtMQjJp3XxcmCj6HZBhkUmMbge',
    symbol: 'bDAO',
    name: 'Bazaar DAO',
    thumbnailUri: 'ipfs://QmVMyqkFKAeyfGBeR81h72ugqj4UM8hjqA7KaKcnc35Vtt',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL',
    symbol: 'YOU',
    name: 'youves YOU Governance',
    thumbnailUri: 'ipfs://QmYAJaJvEJuwvMEgRbBoAUKrTxRTT22nCC9RuY7Jy4L4Gc',
    decimals: 12
  },
  {
    id: 0,
    address: 'KT19JYndHaesXpvUfiwgg8BtE41HKkjjGMRC',
    symbol: 'RCKT',
    name: 'Rocket',
    thumbnailUri:
      'https://gblobscdn.gitbook.com/assets%2F-MayY_wA8g4oLd9eVN9A%2F-MbbCn2yMCnBWfDTMUTb%2F-MbbDTyyuxM6uBAYA6ms%2FToken.png',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT1MuyJ7gVw74FNJpfb2mHR15aCREdyEbe2e',
    symbol: 'rkDAO',
    name: 'Rocket DAO',
    thumbnailUri: 'https://i.ibb.co/3m7xx5C/Rocket-9.png',
    decimals: 8
  },
  {
    id: 0,
    address: 'KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF',
    symbol: 'UNO',
    name: 'Unobtanium',
    thumbnailUri: 'ipfs://QmXdQ3DaMsnqH7MEhX77foWfjxRnj8Qe88mwekkn4PSt3q',
    decimals: 9
  },
  {
    id: 0,
    address: 'KT1XTxpQvo7oRCqp85LikEZgAZ22uDxhbWJv',
    symbol: 'GIF',
    name: 'GIF DAO',
    thumbnailUri: 'ipfs://QmQxoTVVuFS677TQJFdVh1PNRoBmVbvkwJSxe1xvf9cSqU',
    decimals: 9
  },
  {
    id: 0,
    address: 'KT1WapdVeFqhCfqwdHWwTzSTX7yXoHgiPRPU',
    symbol: 'IDZ',
    name: 'TezID',
    thumbnailUri: 'https://tezid.net/idz.png',
    decimals: 8
  },
  {
    id: 0,
    address: 'KT1QgAtLPu3SNq9c6DPLanwL5bvfX3rgh2CS',
    symbol: 'EASY',
    name: 'CryptoEasy',
    thumbnailUri: 'https://cryptoeasy.io/img/cryptoeasy-logo.png',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT19y6R8x53uDKiM46ahgguS6Tjqhdj2rSzZ',
    symbol: 'INSTA',
    name: 'Instaraise',
    thumbnailUri: 'ipfs://QmYMMztcxtohk1t3p4X8DDX45REzeThL1TaJroH5RT5Chj',
    decimals: 9
  },
  {
    id: 0,
    address: 'KT1Rpviewjg82JgjGfAKFneSupjAR1kUhbza',
    symbol: 'xPLENTY',
    name: 'xPLENTY',
    thumbnailUri: 'https://raw.githubusercontent.com/Plenty-DeFi/Plenty-Logo/main/xPlenty.png',
    decimals: 18
  },
  {
    id: 0,
    address: 'KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4',
    symbol: 'ctez',
    name: 'Ctez',
    thumbnailUri: 'ipfs://Qme4ybadbY4H84h5WLPjdo47YQUxxVoJHWZrwYq2JZriM4',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT19DUSZw7mfeEATrbWVPHRrWNVbNnmfFAE6',
    symbol: 'PAUL',
    name: 'PAUL Token',
    thumbnailUri: 'ipfs://QmeoZ5ZnGnCMq8iGPeBjoS628c526DR37jnDstqEnTfkwC',
    decimals: 8
  },
  {
    id: 0,
    address: 'KT1CS2xKGHNPTauSh5Re4qE3N9PCfG5u4dPx',
    symbol: 'SPI',
    name: 'Spice Token',
    thumbnailUri: 'ipfs://QmYQdCWFh26rPoaYNLFBa3mQg3EyXyfgJ5ktG4YrkbD4AZ',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn',
    symbol: 'WTZ',
    name: 'WTZ',
    thumbnailUri: 'ipfs://bafybeidwsid6fvv4vxbqja7er3b4exsht5r7umv6hpz7rc3ujg7xilhwv4',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT1Wa8yqRBpFCusJWgcQyjhRz7hUQAmFxW7j',
    symbol: 'FLAME',
    name: 'FLAME',
    thumbnailUri: 'https://spacefarm.xyz/images/flamelogo.png',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT1KPoyzkj82Sbnafm6pfesZKEhyCpXwQfMc',
    symbol: 'fDAO',
    name: 'fDAO',
    thumbnailUri: 'https://spacefarm.xyz/images/fdaologo.png',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT1F1mn2jbqQCJcsNgYKVAQjvenecNMY2oPK',
    symbol: 'PXL',
    name: 'Pixel',
    thumbnailUri: 'https://cloudflare-ipfs.com/ipfs/Qma4wzNogtUkuhMgzyKBqzaYBqabLVZrHcLbLmJE38B5XH',
    decimals: 6
  },
  {
    id: 1,
    address: 'KT19ovJhcsUn4YU8Q5L3BGovKSixfbWcecEA',
    symbol: 'sDAO',
    name: 'Salsa DAO',
    thumbnailUri: 'ipfs://QmPJ7dMS3T6McqPjjBioKhHqtEUEBhAXpcRf3aicaLNPtV',
    decimals: 0
  },
  {
    id: 0,
    address: 'KT1AM3PV1cwmGRw28DVTgsjjsjHvmL6z4rGh',
    symbol: 'akaDAO',
    name: 'akaSwap DAO',
    thumbnailUri: 'ipfs://QmSpZ1rPgHMPpxUsBCFUM7oERHmDVXUz219no27jWqceH6',
    decimals: 6
  },
  {
    id: 1,
    address: 'KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF',
    symbol: 'MIN',
    name: 'Minerals',
    thumbnailUri: 'ipfs://QmXJdLDEec56EfJVtWW2XRcYBfkmWVHbCRBDAi7YTigisB',
    decimals: 9
  },
  {
    id: 2,
    address: 'KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF',
    symbol: 'ENR',
    name: 'Energy',
    thumbnailUri: 'ipfs://QmVjjDCrjBkETrWgXeL8NDg4DG2Qbi2hdQRpnWiCdS4qwg',
    decimals: 9
  },
  {
    id: 3,
    address: 'KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF',
    symbol: 'MCH',
    name: 'Machinery',
    thumbnailUri: 'ipfs://QmUYksqRFqUA5LUfxFs1oWLmP8Ti2SdyPAq5u72aAQLN7D',
    decimals: 9
  },
  {
    id: 2,
    address: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW',
    symbol: 'uBTC',
    name: 'youves uBTC',
    thumbnailUri: 'ipfs://Qmbev41h4axBqVzxsXP2NSaAF996bJjJBPb8FFZVqTvJTY',
    decimals: 12
  },
  {
    id: 0,
    address: 'KT1KRvNVubq64ttPbQarxec5XdS6ZQU4DVD2',
    symbol: 'MTRIA',
    name: 'Materia',
    thumbnailUri: 'ipfs://QmRrvFBwRKK8cQ6yKXEX38Q34wrWK6FBbCvQPzun5e4kjP',
    decimals: 6
  },
  {
    id: 0,
    address: 'KT1Ha4yFVeyzw6KRAdkzq6TxDHB97KG4pZe8',
    symbol: 'DOGA',
    name: 'DOGAMI',
    thumbnailUri: 'ipfs://QmW8sa5UygUKg58LLzK7NoEDtCRyAQU4wZh1rbpFa6j7kP',
    decimals: 5
  }
];
