import { DelegateResponse } from '@taquito/rpc/dist/types/types';

import { LoadableEntityState } from '../types';

export interface BakingState {
  selectedBakerAddress: LoadableEntityState<DelegateResponse>;
}

export const bakingInitialState: BakingState = {
  selectedBakerAddress: {
    isLoading: false,
    data: null
  }
};

export interface BakingRootState {
  baking: BakingState;
}
