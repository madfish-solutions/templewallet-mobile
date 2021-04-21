import { AssetsInterface, GetAssetsParams } from '../../interfaces/assets.interface';
import { createActions } from '../create-actions';

export const loadAssetsActions = createActions<GetAssetsParams, AssetsInterface[], string>('assets/LOAD');
