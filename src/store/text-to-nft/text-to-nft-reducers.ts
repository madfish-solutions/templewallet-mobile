import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import {
  loadTextToNftOrdersActions,
  setAccessTokenAction,
  setIsHistoryBackButtonAlertShowedOnceAction
} from './text-to-nft-actions';
import { textToNftInitialState, TextToNftState } from './text-to-nft-state';

export const textToNftReducer = createReducer<TextToNftState>(textToNftInitialState, builder => {
  builder.addCase(setIsHistoryBackButtonAlertShowedOnceAction, (state, { payload }) => ({
    ...state,
    isHistoryBackButtonAlertShowedOnce: payload
  }));
  builder.addCase(setAccessTokenAction, (state, { payload }) => ({
    ...state,
    accessToken: payload
  }));
  builder.addCase(loadTextToNftOrdersActions.submit, state => ({
    ...state,
    orders: createEntity(state.orders.data, true)
  }));
  builder.addCase(loadTextToNftOrdersActions.success, (state, { payload: orders }) => ({
    ...state,
    orders: createEntity(orders, false)
  }));
  builder.addCase(loadTextToNftOrdersActions.fail, (state, { payload: error }) => ({
    ...state,
    orders: createEntity([], false, error)
  }));
});
