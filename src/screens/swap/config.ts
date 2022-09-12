import { DexTypeEnum } from 'swap-router-sdk';

export const ROUTING_FEE_ADDRESS = 'tz1XYSt74vwVWgixEXdiS4C5t3UvuExRRTZR';
export const TEZOS_DEXES_API_URL = 'wss://tezos-dexes-api-mainnet.production.madservice.xyz';
export const BLOCK_UPDATE_API_URL = 'wss://tezos-dexes-api-mainnet.production.madservice.xyz/block';

export const ROUTING_FEE_PERCENT = 0.5;
export const ROUTING_FEE_RATIO = (100 - ROUTING_FEE_PERCENT) / 100;

export const KNOWN_DEX_TYPES = [
  DexTypeEnum.QuipuSwap,
  DexTypeEnum.QuipuSwapCurveLike,
  DexTypeEnum.Plenty,
  DexTypeEnum.PlentyStableSwap,
  DexTypeEnum.PlentyVolatileSwap,
  DexTypeEnum.PlentyCtez,
  DexTypeEnum.LiquidityBaking,
  DexTypeEnum.QuipuSwapTokenToTokenDex,
  DexTypeEnum.Youves,
  DexTypeEnum.Vortex,
  DexTypeEnum.Spicy,
  DexTypeEnum.SpicyWrap
];
