import { createReducer } from '@reduxjs/toolkit';

import { isDefined } from '../../utils/is-defined';
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
    accountsStateRecord: {
      ...state.accountsStateRecord,
      [payload.accountPkh]: { accessToken: payload.accessToken, orders: createEntity([]) }
    }
  }));
  builder.addCase(loadTextToNftOrdersActions.submit, (state, { payload: accountPkh }) => ({
    ...state,
    accountsStateRecord: {
      ...state.accountsStateRecord,
      [accountPkh]: {
        ...state.accountsStateRecord[accountPkh],
        orders: createEntity(
          isDefined(state.accountsStateRecord[accountPkh]) ? state.accountsStateRecord[accountPkh].orders.data : [],
          true
        )
      }
    }
  }));
  builder.addCase(loadTextToNftOrdersActions.success, (state, { payload }) => ({
    ...state,
    accountsStateRecord: {
      ...state.accountsStateRecord,
      [payload.accountPkh]: {
        ...state.accountsStateRecord[payload.accountPkh],
        orders: createEntity(payload.orders, false)
      }
    }
  }));
  builder.addCase(loadTextToNftOrdersActions.fail, (state, { payload }) => ({
    ...state,
    accountsStateRecord: {
      ...state.accountsStateRecord,
      [payload.accountPkh]: {
        ...state.accountsStateRecord[payload.accountPkh],
        orders: createEntity([], false, payload.error)
      }
    }
  }));
});
