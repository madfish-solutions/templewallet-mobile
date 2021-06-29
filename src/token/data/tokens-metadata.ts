import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { AssetMetadataInterface, TokenMetadataInterface } from '../interfaces/token-metadata.interface';

export const TEZ_TOKEN_METADATA: AssetMetadataInterface = {
  name: 'Tezos',
  symbol: 'TEZ',
  decimals: 6,
  iconName: IconNameEnum.TezToken
};

export const MAINNET_TOKENS_METADATA: TokenMetadataInterface[] = [
  {
    id: 0,
    address: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
    name: 'Tezos BTC',
    symbol: 'tzBTC',
    decimals: 8,
    iconName: IconNameEnum.TzBtcToken
  },
  {
    id: 0,
    address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
    name: 'Kolibri',
    symbol: 'kUSD',
    decimals: 18,
    iconName: IconNameEnum.KUsdToken
  },
  {
    id: 0,
    address: 'KT1AxaBxkFLCUi3f8rdDAAxBKHfzY8LfKDRA',
    name: 'Quipuswap Liquidating kUSD',
    symbol: 'QLkUSD',
    decimals: 36
  },
  {
    id: 0,
    address: 'KT1VYsVfmobT7rsMVivvZ4J8i3bPiqz12NaH',
    name: 'Wrapped Tezos',
    symbol: 'wXTZ',
    decimals: 6,
    iconName: IconNameEnum.WXtzToken
  },
  {
    id: 0,
    address: 'KT1REEb5VxWRjcHm5GzDMwErMmNFftsE5Gpf',
    name: 'Stably USD',
    symbol: 'USDS',
    decimals: 6,
    iconName: IconNameEnum.UsdSToken
  },
  {
    id: 0,
    address: 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
    name: 'ETH Tez',
    symbol: 'ETHtz',
    decimals: 18,
    iconName: IconNameEnum.EthTzToken
  },
  {
    id: 0,
    address: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
    name: 'USD Tez',
    symbol: 'USDtz',
    decimals: 6,
    iconName: IconNameEnum.UsdTzToken
  },
  {
    id: 0,
    address: 'KT1AEfeckNbdEYwaMKkytBwPJPycz7jdSGea',
    name: 'Staker Governance Token',
    symbol: 'STKR',
    decimals: 18,
    iconName: IconNameEnum.StkrToken
  },
  {
    id: 0,
    address: 'KT1MEouXPpCx9eFJYnxfAWpFA7NxhW3rDgUN',
    name: 'Blend',
    symbol: 'BLND',
    decimals: 18,
    iconName: IconNameEnum.BlndToken
  }
];
