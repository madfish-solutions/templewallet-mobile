import { DexTypeEnum } from 'swap-router-sdk';

export const ROUTING_FEE_ADDRESS = 'tz1XYSt74vwVWgixEXdiS4C5t3UvuExRRTZR';
export const TEZOS_DEXES_API_URL = 'wss://tezos-dexes-api-mainnet.production.madservice.xyz';

const now = new Date().getTime();
const promotionStart = new Date('2022-08-24T00:00:00').getTime();
const promotionEnd = new Date('2022-09-07T00:30:00').getTime();

export const isPromotionTime = now >= promotionStart && now <= promotionEnd;

export const ROUTING_FEE_PERCENT = isPromotionTime ? 0 : 0.5;
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
