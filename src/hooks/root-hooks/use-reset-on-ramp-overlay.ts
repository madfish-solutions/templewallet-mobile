import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';

export const useResetOnRampOverlay = () => {
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Closed)), []);
};
