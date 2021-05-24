import { DelegateResponse } from '@taquito/rpc/dist/types/types';

import { BakerInterface } from '../../interfaces/baker.interface';
import { createActions } from '../create-actions';

export const loadSelectedBakerAddressActions = createActions<string, DelegateResponse, string>(
  'baking/LOAD_SELECTED_BAKER_ADDRESS'
);

export const loadBakersListActions = createActions<void, BakerInterface[], string>('baking/LOAD_BAKERS_LIST');
