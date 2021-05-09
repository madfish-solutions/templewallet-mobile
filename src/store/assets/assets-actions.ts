import { BigNumber } from 'bignumber.js';

import { TokenBalanceInterface } from '../../interfaces/token-balance.interface';
import { createActions } from '../create-actions';

export const loadTokenAssetsActions = createActions<string, TokenBalanceInterface[], string>('assets/LOAD_TOKENS');
export const loadTezosAssetsActions = createActions<string, BigNumber, string>('assets/LOAD_TEZOS');
