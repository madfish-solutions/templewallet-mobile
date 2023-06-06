import { ContractAbstraction, ContractProvider, ContractMethod } from '@taquito/taquito';
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

export interface Route3ContractInterface extends ContractAbstraction<ContractProvider> {
  methods: {
    execute: (
      token_in_id: number,
      token_out_id: number,
      min_out: BigNumber,
      receiver: string,
      hops: Array<Hop>,
      app_id: number
    ) => ContractMethod<ContractProvider>;
  };
}
