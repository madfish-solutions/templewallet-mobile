import { Route3Dex } from 'src/interfaces/route3.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import { createActions } from '../create-actions';

export const loadSwapTokensAction = createActions<void, Array<TokenInterface>, string>('swap/LOAD_ROUTE3_TOKENS');
export const loadSwapDexesAction = createActions<void, Array<Route3Dex>, string>('swap/LOAD_ROUTE3_DEXES');
