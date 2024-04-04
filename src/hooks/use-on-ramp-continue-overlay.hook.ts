import { useIsFocused } from '@react-navigation/native';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { useOnRampOverlayStateSelector } from 'src/store/settings/settings-selectors';

export const useOnRampContinueOverlay = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const state = useOnRampOverlayStateSelector();
  const isOpened = isFocused && state === OnRampOverlayState.Continue;

  const onClose = useCallback(() => dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Closed)), [dispatch]);

  return { isOpened, onClose };
};
