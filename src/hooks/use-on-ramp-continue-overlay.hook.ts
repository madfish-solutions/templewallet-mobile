import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { useOnRampOverlayStateSelector } from 'src/store/settings/settings-selectors';

export const useOnRampContinueOverlay = () => {
  const dispatch = useDispatch();
  const state = useOnRampOverlayStateSelector();
  const isOpened = state === OnRampOverlayState.Continue;

  const onClose = useCallback(() => dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Closed)), [dispatch]);

  return { isOpened, onClose };
};
