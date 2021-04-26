import BigNumber from 'bignumber.js';

import { AssetInterface } from '../../interfaces/asset.interface';
import { createActions } from '../create-actions';

export const loadTokenAssetsActions = createActions<string, AssetInterface[], string>('assets/LOAD_TOKENS');
export const loadTezosAssetsActions = createActions<string, BigNumber, string>('assets/LOAD_TEZOS');
