import { DexTypeEnum } from 'swap-router-sdk';

export const ROUTING_FEE_ADDRESS = 'tz1XYSt74vwVWgixEXdiS4C5t3UvuExRRTZR';

export const ROUTE3_CONTRACT = 'KT1Tuta6vbpHhZ15ixsYD3qJdhnpEAuogLQ9';

export const ROUTING_FEE_PERCENT = 0.35;
export const ROUTING_FEE_RATIO = (100 - ROUTING_FEE_PERCENT) / 100;

export const KNOWN_DEX_TYPES = [
  DexTypeEnum.QuipuSwap,
  DexTypeEnum.QuipuSwap20,
  DexTypeEnum.QuipuSwapCurveLike,
  DexTypeEnum.QuipuSwapTokenToTokenDex,
  DexTypeEnum.Plenty,
  DexTypeEnum.PlentyBridge,
  DexTypeEnum.PlentyStableSwap,
  DexTypeEnum.PlentyVolatileSwap,
  DexTypeEnum.PlentyCtez,
  DexTypeEnum.LiquidityBaking,
  DexTypeEnum.Youves,
  DexTypeEnum.Vortex,
  DexTypeEnum.Spicy,
  DexTypeEnum.SpicyWrap
];
