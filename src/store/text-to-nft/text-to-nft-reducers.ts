import { createReducer } from '@reduxjs/toolkit';

import { setIsHistoryBackButtonAlertShowedOnceAction } from './text-to-nft-actions';
import { textToNftInitialState, TextToNftState } from './text-to-nft-state';

export const textToNftReducer = createReducer<TextToNftState>(textToNftInitialState, builder => {
  builder.addCase(setIsHistoryBackButtonAlertShowedOnceAction, (state, { payload }) => ({
    ...state,
    isHistoryBackButtonAlertShowedOnce: payload
  }));
});
