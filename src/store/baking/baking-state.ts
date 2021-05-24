import { DelegateResponse } from '@taquito/rpc/dist/types/types';

import { BakerInterface } from '../../interfaces/baker.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface BakingState {
  selectedBakerAddress: LoadableEntityState<DelegateResponse>;
  bakersList: LoadableEntityState<BakerInterface[]>;
}

export const bakingInitialState: BakingState = {
  selectedBakerAddress: createEntity(null),
  bakersList: createEntity([])
};

export interface BakingRootState {
  baking: BakingState;
}
