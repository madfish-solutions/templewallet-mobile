import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';

import { resetPermanentInitialSettingsAction } from './settings-actions';
import { settingsReducers } from './settings-reducers';
import { settingsInitialState } from './settings-state';

it('closes a continued on-ramp overlay on a cold start', () => {
  const state = settingsReducers(
    { ...settingsInitialState, onRampOverlayState: OnRampOverlayState.Continue, isShowLoader: true },
    resetPermanentInitialSettingsAction()
  );

  expect(state.onRampOverlayState).toBe(OnRampOverlayState.Closed);
  expect(state.isShowLoader).toBe(false);
});
