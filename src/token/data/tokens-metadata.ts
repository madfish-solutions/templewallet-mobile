import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TokenMetadataInterface } from '../interfaces/token-metadata.interface';

export const TezTokenMetadata: Omit<TokenMetadataInterface, 'address'> = {
  name: 'Tezos',
  symbol: 'XTZ',
  decimals: 6,
  fungible: true,
  iconName: IconNameEnum.XtzToken
};

export const MainnetTokensMetadata: TokenMetadataInterface[] = [
  {
    address: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
    name: 'Tezos BTC',
    symbol: 'tzBTC',
    decimals: 8,
    fungible: true,
    iconName: IconNameEnum.TzBtcToken
  },
  {
    address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
    name: 'Kolibri',
    symbol: 'kUSD',
    decimals: 18,
    fungible: true,
    iconName: IconNameEnum.KUsdToken
  },
  {
    address: 'KT1AxaBxkFLCUi3f8rdDAAxBKHfzY8LfKDRA',
    name: 'Quipuswap Liquidating kUSD',
    symbol: 'QLkUSD',
    decimals: 36,
    fungible: true
  },
  {
    address: 'KT1VYsVfmobT7rsMVivvZ4J8i3bPiqz12NaH',
    name: 'Wrapped Tezos',
    symbol: 'wXTZ',
    decimals: 6,
    fungible: true
  },
  {
    address: 'KT1REEb5VxWRjcHm5GzDMwErMmNFftsE5Gpf',
    id: 0,
    name: 'Stably USD',
    symbol: 'USDS',
    decimals: 6,
    fungible: true
  },
  {
    address: 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
    name: 'ETH Tez',
    symbol: 'ETHtz',
    decimals: 18,
    fungible: true,
    iconName: IconNameEnum.EthTzToken
  },
  {
    address: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
    name: 'USD Tez',
    symbol: 'USDtz',
    decimals: 6,
    fungible: true,
    iconName: IconNameEnum.UsdTzToken
  },
  {
    address: 'KT1AEfeckNbdEYwaMKkytBwPJPycz7jdSGea',
    name: 'Staker Governance Token',
    symbol: 'STKR',
    decimals: 18,
    fungible: true,
    iconName: IconNameEnum.StkrToken
  },
  {
    address: 'KT1MEouXPpCx9eFJYnxfAWpFA7NxhW3rDgUN',
    name: 'Blend',
    symbol: 'BLND',
    decimals: 18,
    fungible: true,
    iconName: IconNameEnum.BlndToken
  }
];
