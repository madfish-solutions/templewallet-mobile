import { Route3Dex, Route3Token } from 'src/interfaces/route3.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import { createActions } from '../create-actions';

export const loadSwapTokensAction = createActions<void, Array<Route3Token>, string>('swap/LOAD_ROUTE3_TOKENS');
export const loadSwapTokensMetadataAction = createActions<void, Array<TokenInterface>, string>(
  'swap/LOAD_ROUTE3_TOKENS_METADATA'
);
export const loadSwapDexesAction = createActions<void, Array<Route3Dex>, string>('swap/LOAD_ROUTE3_DEXES');
