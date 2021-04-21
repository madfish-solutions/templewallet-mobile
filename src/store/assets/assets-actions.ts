import { AssetsInterface } from '../../interfaces/assets.interface';
import { createActions } from '../create-actions';

export const loadAssetsActions = createActions<string, AssetsInterface[], string>('assets/LOAD');
