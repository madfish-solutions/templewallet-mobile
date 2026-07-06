import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ensureOldRpcUrlsRemovedAction } from 'src/store/settings/settings-actions';

export const useEnsureOldRpcUrlsRemoved = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ensureOldRpcUrlsRemovedAction());
  }, []);
};
