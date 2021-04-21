import { createActions } from '../create-actions';
import { AssetsInterface, GetAssetsParams } from '../../interfaces/assets.interface';

export const loadAssetsActions = createActions<GetAssetsParams, AssetsInterface[], string>('assets/LOAD');
