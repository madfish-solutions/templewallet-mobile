import { createReducer } from '@reduxjs/toolkit';

import { changeTheme } from './display-settings-actions';
import { displaySettingsInitialState, DisplaySettingsState } from './display-settings-state';

export const displaySettingsReducer = createReducer<DisplaySettingsState>(displaySettingsInitialState, builder => {
  builder.addCase(changeTheme, (state, { payload }) => ({ ...state, theme: payload }));
});
