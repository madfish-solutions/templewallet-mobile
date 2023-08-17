import { createAction } from '@reduxjs/toolkit';

import {
  Route3Dex,
  Route3SwapParamsResponse,
  Route3Token,
  Route3SwapParamsRequestRaw,
  Route3LiquidityBakingParamsResponse
} from 'src/interfaces/route3.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import { createActions } from '../create-actions';

export const loadSwapParamsAction = createActions<
  Route3SwapParamsRequestRaw,
  Route3SwapParamsResponse | Route3LiquidityBakingParamsResponse,
  string
>('swap/LOAD_SWAP_PARAMS');
export const resetSwapParamsAction = createAction('swap/RESET_SWAP_PARAMS');
export const loadSwapTokensAction = createActions<void, Array<Route3Token>, string>('swap/LOAD_ROUTE3_TOKENS');
export const loadSwapTokensMetadataAction = createActions<void, Array<TokenInterface>, string>(
  'swap/LOAD_ROUTE3_TOKENS_METADATA'
);
export const loadSwapDexesAction = createActions<void, Array<Route3Dex>, string>('swap/LOAD_ROUTE3_DEXES');
