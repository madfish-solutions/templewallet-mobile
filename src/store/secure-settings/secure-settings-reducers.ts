import { createReducer } from '@reduxjs/toolkit';

import { setBiometricsEnabled } from './secure-settings-actions';
import { secureSettingsInitialState, SecureSettingsState } from './secure-settings-state';

export const secureSettingsReducers = createReducer<SecureSettingsState>(secureSettingsInitialState, builder => {
  builder.addCase(setBiometricsEnabled, (state, { payload: biometricsEnabled }) => ({ ...state, biometricsEnabled }));
});
