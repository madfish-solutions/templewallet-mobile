import { createReducer } from '@reduxjs/toolkit';

import { changeTheme, setBiometricsEnabled } from './settings-actions';
import { settingsInitialState, SettingsState } from './settings-state';

export const settingsReducers = createReducer<SettingsState>(settingsInitialState, builder => {
  builder.addCase(changeTheme, (state, { payload: theme }) => ({ ...state, theme }));

  builder.addCase(setBiometricsEnabled, (state, { payload: biometricsEnabled }) => ({ ...state, biometricsEnabled }));
});
