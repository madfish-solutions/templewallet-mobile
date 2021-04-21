import { AssetsInterface } from '../../interfaces/assets.interface';
import { LoadableEntityState } from '../types';

export interface AssetsState {
  tokens: LoadableEntityState<AssetsInterface[]>;
}

export const AssetsInitialState: AssetsState = {
  tokens: {
    data: [],
    isLoading: false
  }
};

export interface AssetsRootState {
  assets: AssetsState;
}
