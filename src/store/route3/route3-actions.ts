import { createAction } from '@reduxjs/toolkit';

import {
  Route3Dex,
  Route3SwapParamsRequest,
  Route3SwapParamsResponse,
  Route3Token
} from 'src/interfaces/route3.interface';

import { createActions } from '../create-actions';

export const loadRoute3TokensAction = createActions<void, Array<Route3Token>, string>('route3/LOAD_ROUTE3_TOKENS');
export const loadRoute3DexesAction = createActions<void, Array<Route3Dex>, string>('route3/LOAD_ROUTE3_DEXES');
export const loadRoute3SwapParamsAction = createActions<Route3SwapParamsRequest, Route3SwapParamsResponse, string>(
  'route3/LOAD_ROUTE3_SWAP_PARAMS'
);
export const resetRoute3SwapParamsAction = createAction('route3/RESET_SWAP_PARAMS');
