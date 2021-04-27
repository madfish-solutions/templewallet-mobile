import { BalanceInterface } from '../../interfaces/balance.interface';
import { createActions } from '../create-actions';

export const loadTokenAssetsActions = createActions<string, BalanceInterface[], string>('assets/LOAD_TOKENS');
export const loadTezosAssetsActions = createActions<string, string, string>('assets/LOAD_TEZOS');
