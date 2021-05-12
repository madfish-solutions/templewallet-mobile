import { TokenBalanceInterface } from '../../token/interfaces/token-balance.interface';
import { createActions } from '../create-actions';

export const loadTokenAssetsActions = createActions<string, TokenBalanceInterface[], string>('assets/LOAD_TOKENS');
export const loadTezosAssetsActions = createActions<string, string, string>('assets/LOAD_TEZOS');
