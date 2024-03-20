import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { resetPermanentInitialSettingsAction } from 'src/store/settings/settings-actions';

export const useResetPermanentInitialSettings = () => {
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void dispatch(resetPermanentInitialSettingsAction()), []);
};
