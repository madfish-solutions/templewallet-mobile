import { Route3Dex, Route3Token } from 'src/interfaces/route3.interface';

import { createActions } from '../create-actions';

export const loadSwapTokensAction = createActions<void, Array<Route3Token>, string>('swap/LOAD_ROUTE3_TOKENS');
export const loadSwapDexesAction = createActions<void, Array<Route3Dex>, string>('swap/LOAD_ROUTE3_DEXES');
