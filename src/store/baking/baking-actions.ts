import { DelegateResponse } from '@taquito/rpc/dist/types/types';

import { createActions } from '../create-actions';

export const loadSelectedBakerAddressActions = createActions<string, DelegateResponse, string>(
  'baking/LOAD_SELECTED_BAKER_ADDRESS'
);
