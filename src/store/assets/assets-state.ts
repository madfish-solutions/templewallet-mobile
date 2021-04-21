import { AssetsInterface } from '../../interfaces/assets.interface';
import { LoadableEntityState } from '../types';

export interface AssetsState extends LoadableEntityState<AssetsInterface[]> {}

export const AssetsInitialState: AssetsState = {
  data: [],
  isLoading: false
};

export interface AssetsRootState {
  assets: LoadableEntityState<AssetsInterface[]>;
}
