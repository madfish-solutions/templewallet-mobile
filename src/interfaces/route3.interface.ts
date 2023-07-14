import { BigNumber } from 'bignumber.js';

import { Route3DexTypeEnum, Route3TokenStandardEnum } from 'src/enums/route3.enum';

export interface Hop {
  amount_opt: BigNumber | null;
  dex_id: number;
  code: number;
  params: string;
}

export interface Route3SwapParamsRequestRaw {
  fromSymbol: string;
  toSymbol: string;
  amount: string | undefined;
}
export interface Route3SwapParamsRequest {
  fromSymbol: string;
  toSymbol: string;
  amount: string;
  chainsLimit?: number;
}

interface Route3Hop {
  dex: number;
  forward: boolean;
}

export interface Route3Chain {
  input: string;
  output: string;
  hops: Array<Route3Hop>;
}

export interface Route3SwapParamsResponse {
  input: string | undefined;
  output: string | undefined;
  chains: Array<Route3Chain>;
}

export type Route3SwapChains = Pick<Route3SwapParamsResponse, 'chains'>;

export interface Route3LiquidityBakingParamsResponse {
  input: string | undefined;
  output: string | undefined;
  tzbtcChain: Route3SwapParamsResponse;
  xtzChain: Route3SwapParamsResponse;
}

export type Route3LiquidityBakingChains = Pick<Route3LiquidityBakingParamsResponse, 'tzbtcChain' | 'xtzChain'>;

export const isSwapChains = (chains: Route3SwapChains | Route3LiquidityBakingChains): chains is Route3SwapChains =>
  'chains' in chains;

export const isLiquidityBakingParamsResponse = (
  response: Route3SwapParamsResponse | Route3LiquidityBakingParamsResponse
): response is Route3LiquidityBakingParamsResponse => 'tzbtcChain' in response && 'xtzChain' in response;

export interface Route3Token {
  id: number;
  symbol: string;
  standard: Route3TokenStandardEnum;
  contract: string | null;
  tokenId: string | null;
  decimals: number;
}

export interface Route3Dex {
  id: number;
  type: Route3DexTypeEnum;
  contract: string;
  token1: Route3Token;
  token2: Route3Token;
}
