import { createAction } from '@reduxjs/toolkit';

import {
  Route3Dex,
  Route3SwapParamsRequest,
  Route3SwapParamsResponse,
  Route3Token
} from 'src/interfaces/route3.interface';

import { createActions } from '../create-actions';

export const loadSwapTokensAction = createActions<void, Array<Route3Token>, string>('swap/LOAD_ROUTE3_TOKENS');
export const loadSwapDexesAction = createActions<void, Array<Route3Dex>, string>('swap/LOAD_ROUTE3_DEXES');
export const loadSwapParamsAction = createActions<Route3SwapParamsRequest, Route3SwapParamsResponse, string>(
  'swap/LOAD_ROUTE3_SWAP_PARAMS'
);

export const resetSwapParamsAction = createAction('swap/RESET_SWAP_PARAMS');
